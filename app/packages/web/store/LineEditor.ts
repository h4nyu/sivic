import { observable } from "mobx";
import { RootApi } from "@sivic/api";
import { LoadingStore } from "./loading";
import { ToastStore } from "./toast";
import { Point } from "@charpoints/core/point";
import { Map, Set } from "immutable";
import { v4 as uuid } from "uuid";
import { keyBy, zip } from "lodash";
import { rotatePoint, getBaseline, Line } from "@sivic/core/utils";

export enum InputMode {
  Add = "Add",
  Edit = "Edit",
}

export type Editor = {
  lines: Map<string, Line>;
  draggingId: string | undefined;
  init: (id: string) => void;
  del: () => void;
  clear: () => void;
  toggleDrag: (id: string) => void;
  getLine: (points: Point[]) => void;
};

export const Editor = (root: {
  api: RootApi;
  loading: <T>(fn: () => Promise<T>) => Promise<T>;
  toast: ToastStore;
  onInit?: (id: string) => void;
  onDelete?: (id: string) => void;
}): Editor => {
  const {
    api,
    loading,
    toast,
    onInit,
    onDelete,
  } = root;

  const init = async (id: string) => {
    onInit && onInit(id)
  };

  const clear = () => {
    self.lines =  Map()
  };

  const getLine = (points: Point[]) => {
    let rows = points;
    const line = getBaseline(rows);
    if(line === undefined){return}
    self.lines = self.lines.set(uuid(), line)
    const [start, end] = line
    rows = rows.filter(p => (
      (p.x !== start.x && p.y !== start.y) 
      && (p.x !== end.x && p.y !== end.y) 
    ))
    const secondLine = getBaseline(rows)
    if(secondLine === undefined){return}
    self.lines = self.lines.set(uuid(), secondLine)
  }

  const toggleDrag = (id: string) => {
    const { draggingId } = self;
    if (draggingId === id) {
      self.draggingId = undefined;
    } else {
      self.draggingId = id;
    }
  };

  const del = () => {
    const { lines, draggingId } = self;
    self.lines = lines.filter((v, k) => k !== draggingId);
    self.draggingId = undefined;
  };

  const self = observable<Editor>({
    lines: Map<string,Line>(),
    draggingId: undefined,
    init,
    clear,
    getLine,
    toggleDrag,
    del,
  })
  return self
};
export default Editor

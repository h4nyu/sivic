import { observable } from "mobx";
import { RootApi } from "@sivic/api";
import { LoadingStore } from "./loading";
import { ToastStore } from "./toast";
import { Point } from "@charpoints/core/point";
import { Box } from "@charpoints/core/box";
import { Map, Set } from "immutable";
import { v4 as uuid } from "uuid";
import { keyBy, zip } from "lodash";
import { rotatePoint, getBaseline, Line } from "@sivic/core/utils";
import { Image } from "@sivic/core/image"
import { ImageStore } from "@sivic/web/store/ImageStore"

export enum InputMode {
  Add = "Add",
  Edit = "Edit",
}

export type Editor = {
  image: Image | undefined;
  points: Map<string, Point>;
  draggingId: string | undefined;
  pos: {x:number, y:number},
  size: number;
  mode: InputMode;
  toggleDrag: (id: string, mode: InputMode) => void;
  setMode: (mode: InputMode) => void;
  add: () => void;
  move: (pos: { x: number; y: number }) => void;
  del: () => void;
  changeSize: (size: number) => void;
  init: (imageId: string) => void;
  clear: () => void;
  save:(imageId:string) => void;
};

export const Editor = (root: {
  api: RootApi;
  imageStore: ImageStore;
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
    imageStore
  } = root;


  const init = async (imageId:string) => {
    self.image = imageStore.images.get(imageId)
    if(self.image){
      console.log(self.image.data)
    }
    onInit && onInit(imageId)
  };

  const clear = () => {
    self.points = Map();
  };

  const setMode = (mode: InputMode) => {
    self.mode = mode;
  };

  const toggleDrag = (id: string, mode: InputMode) => {
    const { draggingId } = self;
    if (draggingId === id) {
      self.draggingId = undefined;
    } else {
      self.draggingId = id;
    }
    setMode(mode);
  };

  const move = (pos: { x: number; y: number }) => {
    const { points, draggingId, mode } = self;
    self.pos = pos;
    if (draggingId === undefined) {
      return;
    }
    if (mode === InputMode.Edit) {
      const point = points.get(draggingId);
      if (point === undefined) {
        return;
      }
      self.points = points.set(draggingId, { ...point, x: pos.x, y: pos.y });
    } 
  };

  const add = () => {
    const { mode, pos, points } = self;
    if ((self.draggingId = undefined)) {
      self.draggingId = undefined;
      return;
    }
    const newId = uuid();
    if (
      [
        InputMode.Add,
        InputMode.Edit,
      ].includes(mode)
    ) {
      self.points = self.points.set(newId, Point({
        x: pos.x,
        y: pos.y,
      }))
      setMode(InputMode.Edit);
    }
    self.draggingId = newId;
  };

  const del = () => {
    const { points, draggingId } = self;
    self.points = points.filter((v, k) => k !== draggingId);
    self.draggingId = undefined;
  };

  const changeSize = (value: number) => {
    self.size = value;
  };

  const save = async (imageId:string) => {
    const err = await api.point.replace({imageId, points:self.points.toList().toJS()})
    if(err instanceof Error) { return err }
  };

  const self = observable<Editor>({
    image: undefined,
    points: Map<string, Point>(),
    draggingId: undefined,
    size: 10,
    pos: { x: 0, y:0 },
    mode: InputMode.Add,
    setMode,
    toggleDrag,
    move,
    changeSize,
    add,
    del,
    init,
    clear,
    save,
  })

  return self
};
export default Editor

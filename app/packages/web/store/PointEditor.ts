import { observable } from "mobx";
import { Map, List } from "immutable";
import { RootApi } from "@sivic/api";
import { LoadingStore } from "./loading";
import { ToastStore } from "./toast";
import { Point } from "@charpoints/core/point";
import { Box } from "@charpoints/core/box";
import { v4 as uuid } from "uuid";
import { keyBy, zip } from "lodash";
import { rotatePoint, getBaseline, Line } from "@sivic/core/utils"; import { Image } from "@sivic/core/image"
import { ImageStore } from "@sivic/web/store/ImageStore"

import PointStore from "@sivic/web/store/PointStore"
export enum InputMode {
  Add = "Add",
  Edit = "Edit",
}

export type Editor = {
  images: List<Image>;
  imageId: string;
  cursor:number;
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
  save:() => void;
  next: () => undefined | string;
  prev: () => undefined | string;
};

export const Editor = (root: {
  api: RootApi;
  imageStore: ImageStore;
  pointStore: PointStore;
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
    imageStore,
    pointStore,
  } = root;

  const init = async (imageId:string) => {
    self.imageId = imageId
    self.cursor = self.images.findIndex((x) => x.id === imageId);
    await pointStore.fetch({imageId})
    self.points = pointStore.points.filter(x => x.imageId === self.imageId)
    onInit && onInit(imageId)
  };
  const getImages = () => {
    const currentImage = imageStore.images.get(self.imageId)
    return imageStore
      .images
      .filter(x => x.parentId === currentImage?.parentId)
      .toList()
  }
  const getPoints = () => {
  }

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

  const save = async () => {
    const err = await api.point.replace({imageId: self.imageId, points:self.points.toList().toJS()})
    if(err instanceof Error) { return err }
  };

  const next = () => {
    const img = self.images.get(self.cursor + 1);
    if (img) {
      self.cursor = self.cursor + 1;
    }
    return img?.id;
  };

  const prev = () => {
    const img = self.images.get(self.cursor - 1);
    if (img) {
      self.cursor = self.cursor - 1;
    }
    return img?.id;
  };

  const self = observable<Editor>({
    imageId: "",
    get images(){ return getImages() },
    cursor:0,
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
    next,
    prev,
  })

  return self
};
export default Editor

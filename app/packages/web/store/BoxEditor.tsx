import { observable } from "mobx";
import { Box } from "@charpoints/core/box";
import { Map, Set } from "immutable";
import { v4 as uuid } from "uuid";
import { keyBy, zip } from "lodash";

export enum InputMode {
  Box = "Box",
  TL = "TL",
  TR = "TR",
  BL = "BL",
  BR = "BR",
}

export type Editor = {
  boxes: Map<string, Box>;
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
  init: (id: string) => void;
  clear: () => void;
};
export const Editor = (root: {
  onInit?: (id: string) => void;
  onDelete?: (id: string) => void;
}): Editor => {
  const {
    onInit,
    onDelete,
  } = root;
  const init = async (id: string) => {
  };
  const clear = () => {
    self.boxes = Map();
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
    const { boxes, draggingId, mode } = self;
    self.pos = pos;
    if (draggingId === undefined) {
      return;
    }
    if (mode === InputMode.TL) {
      const box = boxes.get(draggingId);
      if (box === undefined) {
        return;
      }
      if (pos.x > box.x1) {
        return setMode(InputMode.TR);
      }
      if (pos.y > box.y1) {
        return setMode(InputMode.BL);
      }
      self.boxes = boxes.set(draggingId, { ...box, x0: pos.x, y0: pos.y });
    } else if (mode === InputMode.BR) {
      const box = boxes.get(draggingId);
      if (box === undefined) {
        return;
      }
      if (pos.x < box.x0) {
        return setMode(InputMode.BL);
      }
      if (pos.y < box.y0) {
        return setMode(InputMode.TR);
      }
      self.boxes = boxes.set(draggingId, { ...box, x1: pos.x, y1: pos.y });
    } else if (mode === InputMode.BL) {
      const box = boxes.get(draggingId);
      if (box === undefined) {
        return;
      }
      if (pos.x > box.x1) {
        return setMode(InputMode.BR);
      }
      if (pos.y < box.y0) {
        return setMode(InputMode.TL);
      }
      self.boxes = boxes.set(draggingId, { ...box, x0: pos.x, y1: pos.y });
    } else if (mode === InputMode.TR) {
      const box = boxes.get(draggingId);
      if (box === undefined) {
        return;
      }
      if (pos.x < box.x0) {
        return setMode(InputMode.TL);
      }
      if (pos.y > box.y1) {
        return setMode(InputMode.BR);
      }
      self.boxes = boxes.set(draggingId, { ...box, x1: pos.x, y0: pos.y });
    }
  };

  const add = () => {
    const { mode, pos, boxes } = self;
    if ((self.draggingId = undefined)) {
      self.draggingId = undefined;
      return;
    }
    const newId = uuid();
    if (
      [
        InputMode.Box,
        InputMode.TR,
        InputMode.TL,
        InputMode.BL,
        InputMode.BR,
      ].includes(mode)
    ) {
      self.boxes = self.boxes.set(newId, Box({
        x0: pos.x,
        y0: pos.y,
        x1: pos.x,
        y1: pos.y,
      }))
      setMode(InputMode.BR);
    }
    self.draggingId = newId;
  };

  const del = () => {
    const { boxes, draggingId } = self;
    self.boxes = boxes.filter((v, k) => k !== draggingId);
    self.draggingId = undefined;
  };

  const changeSize = (value: number) => {
    self.size = value;
  };

  const self = observable<Editor>({
    boxes: Map<string,Box>(),
    draggingId: undefined,
    size: 0,
    pos: { x: 0, y:0 },
    mode: InputMode.Box,
    setMode,
    toggleDrag,
    move,
    changeSize,
    add,
    del,
    init,
    clear,
  })

  return self
};

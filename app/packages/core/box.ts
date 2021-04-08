import { v4 as uuid } from 'uuid';
import { Lock, ErrorKind, Store } from ".";
import { uniq } from "lodash"
import { Box } from "@charpoints/core/box"

type PascalBox = {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  label?: string;
};

export type FilterPayload = {
  imageId:string
};

export type ReplacePayload = {
  imageId:string
  boxes: Box[];
};

export type Service = {
  filter: (payload: FilterPayload) => Promise<Box[] | Error>;
  replace: (payload: ReplacePayload) => Promise<void | Error>;
};

export const Service = (args: { store: Store; lock: Lock }): Service => {
  const { store, lock } = args;

  const filter = async (payload: FilterPayload) => {
    return await store.box.filter(payload);
  };

  const replace = async (payload: ReplacePayload) => {
    return await store.box.replace(payload);
  };

  return {
    filter,
    replace 
  }
}

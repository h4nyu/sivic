import { v4 as uuid } from 'uuid';
import { Lock, ErrorKind, Store } from ".";
import { uniq } from "lodash"
import { Point } from "@charpoints/core/point"



export type FilterPayload = {
  imageId:string
};

export type ReplacePayload = {
  imageId:string
  points: Point[];
};

export type Service = {
  filter: (payload: FilterPayload) => Promise<Point[] | Error>;
  replace: (payload: ReplacePayload) => Promise<void | Error>;
};


export const Service = (args: { store: Store; lock: Lock }): Service => {
  const { store, lock } = args;

  const filter = async (payload: FilterPayload) => {
    return await store.point.filter(payload);
  };

  const replace = async (payload: ReplacePayload) => {
    return await store.point.replace(payload);
  };

  return {
    filter,
    replace,
  }
}

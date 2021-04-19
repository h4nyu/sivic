import { v4 as uuid } from 'uuid';
import { Lock, ErrorKind, Store } from ".";
import { uniq } from "lodash"
import { Point } from "@charpoints/core/point"


export type FilterPayload = {
  imageId:string
};


export type Service = {
  filter: (payload: FilterPayload) => Promise<Point[] | Error>;
};

export const Service = (args: { store: Store; lock: Lock }): Service => {
  const { store, lock } = args;

  const filter = async (payload: FilterPayload) => {
    return await store.point.filter(payload);
  };

  return {
    filter,
  }
}

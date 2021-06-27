import { v4 as uuid } from 'uuid';
import { Lock, ErrorKind, Store } from ".";
import { uniq } from "lodash"
import { Box } from "@charpoints/core/box"
import { Service as ImageService, Image } from "@sivic/core/image"

export type Line = {
  id: string
  imageId?: string;
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

export const Line  = (args?:{
  id?:string,
  x0?:number,
  y0?:number,
  x1?:number,
  y1?:number,
  imageId?:string,
}) => {
  const id = args?.id || uuid()
  const x0 = args?.x0 || 0
  const y0 = args?.y0 || 0
  const x1 = args?.x1 || 0
  const y1 = args?.y1 || 0
  const imageId = args?.imageId || undefined
  return {
    id,
    x0,
    y0,
    x1,
    y1,
    imageId,
  }
}


export type FilterPayload = {
  imageId:string
};

export type ReplacePayload = {
  imageId:string
  lines: Line[];
};
export type Service = {
  filter: (payload: FilterPayload) => Promise<Line[] | Error>;
  replace: (payload: ReplacePayload) => Promise<void | Error>;
};

export const Service = (args: { store: Store; lock: Lock }): Service => {
  const { store, lock } = args;
  const filter = async (payload: FilterPayload) => {
    return await store.line.filter(payload);
  };

  const replace = async (payload: ReplacePayload) => {
    const { imageId, lines } = payload
    let err = await store.line.delete({imageId});
    if(err instanceof Error) { return err;  }
    err = await store.line.load(lines.map(x => {
      return {
        ...x,
        imageId,
      }
    }));
    if(err instanceof Error) { return err;  }
  };
  return {
    filter,
    replace
  }
}

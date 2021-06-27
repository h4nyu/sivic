import { v4 as uuid } from 'uuid';
import { Lock, ErrorKind, Store } from ".";
import { uniq } from "lodash"

export type Point = {
  id: string;
  x: number;
  y: number;
  imageId?: string;
  equals: (other:Point) => boolean;
};

export const Point = (args?: {
  id?: string;
  x?: number;
  y?: number,
  imageId?: string,
}): Point => {
  const id = args?.id || uuid()
  const imageId = args?.imageId || undefined
  const x = args?.x || 0
  const y = args?.y || 0
  const equals = (other: Point): boolean => {
    return (
      self.x === other.x && self.y === other.y
    )
  }
  const self = {
    id,
    x,
    y,
    imageId,
    equals,
  }
  return self
};


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
    await lock.auto(async () => {
      const image = await store.image.find({id: payload.imageId})
      if(image instanceof Error) { return image }
      let err = await store.point.delete({ imageId: image.id })
      if(err instanceof Error) { return err }
      err = await store.point.load(payload.points)
      if(err instanceof Error) { return err }
    })
  };

  return {
    filter,
    replace,
  }
}

import { v4 as uuid } from 'uuid';
import { Lock, ErrorKind, Store } from ".";
import { uniq } from "lodash"
import { Service as ImageService, Image } from "@sivic/core/image"

export type Box = {
  id: string;
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  tagId? :string,
  imageId?: string,
  validate: () => void | Error;
}
export const Box = (args?:{
  id?: string,
  x0?: number,
  y0?: number,
  x1?: number,
  y1?: number,
  imageId?: string,
  tagId?:string,
}):Box => {
  const id = args?.id || uuid()
  const x0 = args?.x0 || 0
  const y0 = args?.y0 || 0
  const x1 = args?.x1 || 0
  const y1 = args?.y1 || 0
  const imageId = args?.imageId
  const tagId = args?.tagId
  const validate = () => {
    if (self.x0 >= self.x1 || self.y0 >= self.y1) {
      return new Error(ErrorKind.ZeroSizeBox);
    }
  }
  const self = {
    id,
    x0,
    y0,
    x1,
    y1,
    imageId,
    tagId,
    validate,
  }
  return self
}

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
  const imageService = ImageService(args)
  const { store, lock } = args;

  const filter = async (payload: FilterPayload) => {
    return await store.box.filter(payload);
  };

  const replace = async (payload: ReplacePayload) => {
    const image = await imageService.find({id: payload.imageId, hasData: true})
    if(image instanceof Error) { return image }
    const imageData = image.data
    const cropedImages:Image[] = []
    for(const box of payload.boxes){
      // const croped = await store.transform.crop({imageData, box})
      // if(croped instanceof Error) { return croped }
      // cropedImages.push(
      //   Image({
      //     id: box.id,
      //     data: croped,
      //     workspaceId: image.workspaceId,
      //     parentId: image.id,
      //   })
      // )
    }
    let err = await store.box.delete({imageId: payload.imageId});
    if(err instanceof Error) { return err;}
    err = await store.box.load(payload.boxes);
    if(err instanceof Error) { return err;}

    const savedBoxImages = await store.image.filter({parentId: image.id})
    if(savedBoxImages instanceof Error) { return savedBoxImages }
    for (const sb of savedBoxImages ){
      err = await store.image.delete({id: sb.id})
      if(err instanceof Error) { return err;}
    }
    for (const img of cropedImages){
      err = await store.image.insert(img);
      if(err instanceof Error) { return err;}
    }
  };

  return {
    filter,
    replace 
  }
}

import { v4 as uuid } from 'uuid';
import { Lock, ErrorKind, Store } from ".";
import { uniq } from "lodash"
import { Box } from "@charpoints/core/box"
import { Service as ImageService, Image } from "@sivic/core/image"

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
      const croped = await store.transform.crop({imageData, box})
      if(croped instanceof Error) { return croped }
      cropedImages.push(
        Image({
          id: box.id,
          data: croped,
          workspaceId: image.workspaceId,
          parentId: image.id,
        })
      )
    }
    let err = await store.box.replace(payload);
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

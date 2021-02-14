import { Lock, Store, DetectedBoxesFn, ErrorKind } from "@sivic/core"
import { Image as CharImage } from "@charpoints/core/image"
import { Box as CharBox } from "@charpoints/core/box"

export type ImageTag = "Source" | "Target"

export type Image = CharImage & {
  tag: ImageTag
}

export type CreatePayload = {
  id?: string;
  name: string;
  data: string; //base64
};

export type DeletePayload = {
  id: string;
};

export type FindPayload = {
  id: string;
};

export type DetectCharBoxFn = (payload: {imageId: string}) => Promise<CharBox[]|Error>

const DetectCharBox = (args:{
  store: Store,
  detectBoxes: DetectedBoxesFn
}):DetectCharBoxFn => {
  const { store, detectBoxes } = args
  return async (payload: {imageId:string}) => {
    const image = await store.image.find({id: payload.imageId })
    if(image instanceof Error) { return image }
    if(image.data === undefined) { return new Error(ErrorKind.ImageNotFound) }
    const detectRes = await detectBoxes({data: image.data})
    if(detectRes instanceof Error) { return detectRes }
    const [boxes, data] = detectRes
    image.data = data
    // let updateErr = await store.image.update(image)
    // if(updateErr instanceof Error) { return updateErr }
    return boxes.map( x => {
      return {...x, imageId: image.id}
    })
  }
}

export type Service = {
  create: (payload: CreatePayload) => Promise<string | Error>;
  delete: (payload: DeletePayload) => Promise<string | Error>;
  find: (payload: FindPayload) => Promise<Image | Error>;
};

export const Service = (args: { store: Store; lock: Lock }): Service => {
  const { store, lock } = args;
  const find = async (payload: FindPayload) => {
    const image = await store.image.find(payload);
    if (image instanceof Error) {
      return image;
    }
    if (image === undefined) {
      return new Error(ErrorKind.ImageNotFound);
    }
    return image;
  };

  const create = async (payload: CreatePayload) => {
    return await lock.auto(async () => {
      // const { data, id, name } = payload;
      // const row = Image()
      // row.data = data
      // row.id = id || row.id || uuid()
      // row.name = name
      // const prev = await store.image.find({id: row.id});
      // if(prev instanceof Error) {return prev}
      // if(prev !== undefined) {
      //   return new Error(ErrorKind.ImageAlreadyExist)
      // }
      // let err = await store.image.insert(row);
      // if (err instanceof Error) {
      //   return err;
      // }
      // return row.id;
      return "TODO"
    });
  };

  const delete_ = async (payload: DeletePayload) => {
    return await lock.auto(async () => {
      // const { id } = payload;
      // const row = await store.image.find({ id });
      // if (row instanceof Error) {
      //   return row;
      // }
      // if (row === undefined) {
      //   return new Error(ErrorKind.ImageNotFound);
      // }
      // let err = await store.image.delete({ id });
      // if (err instanceof Error) {
      //   return err;
      // }
      // err = await store.point.delete({ imageId: id });
      // if (err instanceof Error) {
      //   return err;
      // }
      // err = await store.box.delete({ imageId: id });
      // if (err instanceof Error) {
      //   return err;
      // }
      return "TODO"
    });
  };

  return {
    create,
    find,
    delete: delete_,
  };
};

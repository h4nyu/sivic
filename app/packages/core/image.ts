import { v4 as uuid } from 'uuid';
import { Lock, Store, ErrorKind } from "@sivic/core"
import { Service as FileService } from "@sivic/core/file"
import { File } from "@sivic/core/file"

export const ImageTag = {
  Source: "Source",
  Target: "Target"
} as const


export type ImageTag = typeof ImageTag[keyof typeof ImageTag];

export type Image = {
  id: string,
  name: string,
  workspaceId?: string,
  parentId?: string
  tagId?: string,
  fileId?: string,
  createdAt: Date,
}
export const Image = (args?:{
  id?:string,
  name?: string,
  workspaceId?:string,
  parentId?: string,
  tagId?:string,
  fileId?: string,
  createdAt?: Date,
}):Image => {
  const id = args?.id || uuid()
  const name = args?.name || ""
  const workspaceId = args?.workspaceId
  const parentId = args?.parentId
  const tagId = args?.tagId
  const createdAt = args?.createdAt || new Date()
  const fileId = args?.fileId
  return {
    id,
    name,
    workspaceId,
    parentId,
    tagId,
    fileId,
    createdAt,
  }
}


export type UpdatePayload = {
  id: string;
  name: string;
  workspaceId: string;
  data?: string; //base64
  tag?: ImageTag;
};


export type DetectBoxPayload = {imageId: string}


type DetectedBoxes = {
  x0:number,
  y0:number,
  x1:number,
  y1:number,
  confidence: number,
}[]
export type DetectBoxes = (payload: {data :string}) => Promise<[DetectedBoxes, string] | Error>;

const DetectBoxFn = (args:{
  store: Store,
  detectBoxes: DetectBoxes,
  lock: Lock
}) => {
  const { store, detectBoxes } = args
  const services = {
    image: Service(args),
    file: FileService(args)
  }
  return async (payload: {imageId:string}) => {
    const image = await services.image.find({id: payload.imageId })
    if(image instanceof Error) { return image }
    const file = await services.file.find({id: image.id})
    if(file instanceof Error) { return file }
    const detectRes = await detectBoxes({data: file.data})
    if(detectRes instanceof Error) { return detectRes }
    const [boxes, data] = detectRes
    return boxes.map( x => {
      return {...x, imageId: image.id}
    })
  }
}

export type CreatePayload = {
  name: string;
  workspaceId: string;
  data: string; //base64
};
export type CreateFn = (payload: CreatePayload) => Promise<Image | Error>
export const CreateFn = (props: {
  store: Store,
}):CreateFn => {
  return async (payload: CreatePayload) => {
    const file = File({
      data:payload.data,
    })
    const fileErr = await props.store.file.insert(file)
    if(fileErr instanceof Error) { return fileErr }
    const image = Image({
      name: payload.name,
      fileId: file.id,
      workspaceId: payload.workspaceId,
    })
    const imageErr = await props.store.image.insert(image)
    if(imageErr instanceof Error) { return imageErr}
    return image
  }
}


export type FilterPayload = {
  workspaceId?: string;
  parentId?: string
  ids?: string[]
};
export type FilterFn = (payload:FilterPayload) => Promise<Image[] | Error>
export const FilterFn = (props: {
  store: Store,
}): FilterFn => {
  return async (payload: FilterPayload) => {
    return await props.store.image.filter(payload)
  }
}


export type FindPayload = {
  id: string;
  hasData?: boolean;
};
export type FindFn = (payload:FindPayload) => Promise<Image | Error>
export const FindFn = (props: {
  store: Store,
}): FindFn => {
  return async (payload: FindPayload) => {
    const image = await props.store.image.find(payload)
    if(image instanceof Error) { return image }
    if(image === undefined) { return new Error(ErrorKind.ImageNotFound) }
    return image
  }
}

export type DeletePayload = {
  id: string;
};
export type DeleteFn = (payload:DeletePayload) => Promise<void | Error>
export const DeleteFn = (props: {
  store: Store,
}) => {
  const find = FindFn(props)
  return async (payload: DeletePayload) => {
    const image = await find({id: payload.id})
    if(image instanceof Error) { return image }
    let err = await props.store.image.delete({id:payload.id})
    if(err instanceof Error) { return err }
    err = await props.store.file.delete({id:image.fileId})
    if(err instanceof Error) { return err }
  }
}

export type Service = {
  create: (payload: CreatePayload) => Promise<string | Error>;
  filter: (payload:FilterPayload) => Promise<Image[] | Error>;
  update: (payload: UpdatePayload) => Promise<string | Error>;
  delete: (payload: DeletePayload) => Promise<string | Error>;
  find: (payload: FindPayload) => Promise<Image | Error>;
};

export const Service = (args: { store: Store; lock: Lock }): Service => {
  const { store, lock } = args;
  const filter = async (payload:FilterPayload) => {
    return await store.image.filter(payload);
  }
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
      const file = File({
        data: payload.data,
      })
      const fileErr = await store.file.insert(file)
      if(fileErr instanceof Error) { return fileErr}
      const row = Image({
        name: payload.name,
        workspaceId: payload.workspaceId,
        fileId: file.id,
      })
      let err = await store.image.insert(row);
      if (err instanceof Error) { return err; }
      return row.id
    });
  };

  const update = async (payload: UpdatePayload) => {
    return await lock.auto(async () => {
      const row = await find({ id:payload.id, hasData: false });
      if(row instanceof Error) { return row }
      const newRow = {
        ...row,
        ...payload,
        updatedAt: new Date(),
      }
      let err = await store.image.update(newRow);
      if (err instanceof Error) { return err; }
      return row.id
    });
  };

  const delete_ = async (payload: DeletePayload) => {
    return await lock.auto(async () => {
      const { id } = payload;
      const row = await find({ id });
      if (row instanceof Error) { return row; }
      let err = await store.image.delete({ id });
      if (err instanceof Error) { return err; }
      err = await store.file.delete({ id: row.fileId });
      if (err instanceof Error) { return err; }
      return row.id
    });
  };

  return {
    create,
    update,
    find,
    filter,
    delete: delete_,
  };
};

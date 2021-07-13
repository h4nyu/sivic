import { v4 as uuid } from 'uuid';
import { Lock, ErrorKind, Store } from "@sivic/core";
import { uniq } from "lodash"
import { 
  FilterFn as FilterImageFn,
  DeleteFn as DeleteImageFn
} from "@sivic/core/image"

import CreateFn from "@sivic/core/workspace/create"

export type Workspace = {
  id: string
  name: string
  imageIds: string[]
  createdAt: Date
}


export type UpdatePayload = {
  id: string;
  name: string;
};


export type DeletePayload = {
  id: string;
};

export type AddImagePayload = {
  workspaceId: string;
  imageId: string;
};

export const Workspace = (args?: {
  id?: string,
  name?: string,
  imageIds?:string[],
  createdAt?: Date,
}):Workspace => {
  const id = args?.id ?? uuid()
  const name = args?.name ?? ""
  const imageIds = args?.imageIds ?? []
  const createdAt = args?.createdAt ?? new Date()
  return {
    id,
    name,
    imageIds,
    createdAt,
  }
}

export type FilterPayload = {
  ids?: string[];
};
export type FilterFn = (payload: FilterPayload) => Promise<Workspace[] | Error>
export const FilterFn = (props: {
  store: Store,
}):FilterFn => {
  return async (payload: FilterPayload) => {
    const workspaces = await props.store.workspace.filter(payload)
    if(workspaces instanceof Error) { return workspaces }
    return workspaces
  }
}

export type FindPayload = {
  id: string;
};
export type FindFn = (payload: FindPayload) => Promise<Workspace | Error>
export const FindFn = (props: {
  store: Store,
}):FindFn => {
  return async (payload: FindPayload) => {
    const workspace = await props.store.workspace.find(payload)
    if(workspace instanceof Error) { return workspace }
    if(workspace === undefined) { return new Error(ErrorKind.WorkspaceNotFound) }
    return workspace
  }
}

export type DeleteFn = (payload: DeletePayload) => Promise<void | Error>
export const DeleteFn = (props: {
  store: Store,
  deleteImage: DeleteImageFn,
  filterImage: FilterImageFn,
}) => {
  const find = FindFn(props)
  return async (payload: FindPayload) => {
    const workspace = await find(payload)
    if(workspace instanceof Error) { return workspace }

    const images = await props.filterImage({workspaceId: workspace.id})
    if(images instanceof Error) { return images}
    for(const image of images){
      const err = await props.deleteImage({id: image.id})
      if (err instanceof Error) { return err; }
    }

    let err = await props.store.workspace.delete({id: payload.id})
    if(err instanceof Error) { return err }
  }
}

export type Service = {
  create: CreateFn,
  find: FindFn,
  filter: FilterFn,
  delete: DeleteFn,
  // update: UpdateFn
};

// export const Service = (args: { 
//   store: Store; 
//   lock: Lock 
// }): Service => {
//   const { store, lock } = args;
//   const filter = async (payload: FilterPayload) => {
//     return await store.workspace.filter(payload);
//   };
//   const getCtx = async (workspaceId:string):Promise<{workspace:Workspace} | Error> => {
//       const workspace = await store.workspace.find({id:workspaceId})
//       if(workspace instanceof Error) {
//         return workspace
//       }
//       if(workspace === undefined) {return new Error(ErrorKind.WorkspaceNotFound)}
//       return {
//         workspace
//       }
//   }

//   const find = async (payload: FindPayload) => {
//     const ctx = await getCtx(payload.id)
//     if(ctx instanceof Error) { return ctx }
//     return ctx.workspace
//   };
//   const create = async (payload: CreatePayload) => {
//     return await lock.auto(async () => {
//       const { name, id } = payload;
//       const workspace = Workspace(payload)
//       const uniqErr = await checkUniq(workspace)
//       if(uniqErr instanceof Error) { return uniqErr }
//       let err = await store.workspace.insert(workspace);
//       if (err instanceof Error) {
//         return err;
//       }
//       return workspace;
//     });
//   };

//   const update = async (payload: UpdatePayload) => {
//     return await lock.auto(async () => {
//       const { name, id } = payload;
//       const workspace = await find({id: payload.id})
//       if(workspace instanceof Error) {return workspace}
//       workspace.name = payload.name
//       const uniqErr = await checkUniq(workspace)
//       if(uniqErr instanceof Error) { return uniqErr }
//       let err = await store.workspace.update(workspace);
//       if (err instanceof Error) {
//         return err;
//       }
//       return workspace;
//     });
//   };

//   const delete_ = async (payload: DeletePayload) => {
//     return await lock.auto(async () => {
//       const { id } = payload;
//       const row = await find({ id })
//       if (row instanceof Error) { return row; }
//       // const savedImages = await services.image.filter({workspaceId: id})
//       // if (savedImages instanceof Error) { return savedImages }
//       // for(const img of savedImages){
//       //   const err = await services.image.delete({id: img.id})
//       //   if (err instanceof Error) { return err; }
//       // }
//       const deleteTagErr = await store.tag.delete({workspaceId: payload.id})
//       if(deleteTagErr instanceof Error) { return deleteTagErr }

//       let err = await store.workspace.delete({ id });

//       if (err instanceof Error) { return err; }
//       return id;
//     });
//   }

//   return {
//     filter,
//     find,
//     create,
//     delete: delete_,
//     update,
//   }
// }

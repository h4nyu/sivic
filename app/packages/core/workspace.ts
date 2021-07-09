import { v4 as uuid } from 'uuid';
import { Lock, ErrorKind, Store } from ".";
import { uniq } from "lodash"

export type Workspace = {
  id: string
  name: string
  imageIds: string[]
  createdAt: Date
}

export type FilterPayload = {
  ids?: string[];
};

export type CreatePayload = {
  id?: string;
  name: string;
};

export type UpdatePayload = {
  id: string;
  name: string;
};

export type FindPayload = {
  id: string;
};

export type DeletePayload = {
  id: string;
};

export type AddImagePayload = {
  workspaceId: string;
  imageId: string;
};

export type DeleteImagePayload = {
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

export type Service = {
  create: (payload: CreatePayload) => Promise<Workspace | Error>;
  find: (payload: FindPayload) => Promise<Workspace | Error>;
  filter: (payload: FilterPayload) => Promise<Workspace[] | Error>;
  delete: (payload: DeletePayload) => Promise<string| Error>;
  update: (payload: UpdatePayload) => Promise<Workspace | Error>;
};

export const Service = (args: { store: Store; lock: Lock }): Service => {
  const { store, lock } = args;
  const filter = async (payload: FilterPayload) => {
    return await store.workspace.filter(payload);
  };
  const getCtx = async (workspaceId:string):Promise<{workspace:Workspace} | Error> => {
      const workspace = await store.workspace.find({id:workspaceId})
      if(workspace instanceof Error) {
        return workspace
      }
      if(workspace === undefined) {return new Error(ErrorKind.WorkspaceNotFound)}
      return {
        workspace
      }
  }

  const find = async (payload: FindPayload) => {
    const ctx = await getCtx(payload.id)
    if(ctx instanceof Error) { return ctx }
    return ctx.workspace
  };
  const checkUniq = async (workspace: Workspace):Promise<void | Error> => {
    const row = await store.workspace.find({name: workspace.name})
    if(row instanceof Error) { return row }
    if(row?.id !== workspace.id && row?.name === workspace.name ){
      return new Error(ErrorKind.WorkspaceAlreadyExist)
    }
  }

  const create = async (payload: CreatePayload) => {
    return await lock.auto(async () => {
      const { name, id } = payload;
      const workspace = Workspace(payload)
      const uniqErr = await checkUniq(workspace)
      if(uniqErr instanceof Error) { return uniqErr }
      let err = await store.workspace.insert(workspace);
      if (err instanceof Error) {
        return err;
      }
      return workspace;
    });
  };

  const update = async (payload: UpdatePayload) => {
    return await lock.auto(async () => {
      const { name, id } = payload;
      const workspace = await find({id: payload.id})
      if(workspace instanceof Error) {return workspace}
      workspace.name = payload.name
      const uniqErr = await checkUniq(workspace)
      if(uniqErr instanceof Error) { return uniqErr }
      let err = await store.workspace.update(workspace);
      if (err instanceof Error) {
        return err;
      }
      return workspace;
    });
  };

  const delete_ = async (payload: DeletePayload) => {
    return await lock.auto(async () => {
      const { id } = payload;
      const row = await store.workspace.find({ id });
      if (row instanceof Error) { return row; }
      if (row === undefined) { return new Error(ErrorKind.WorkspaceNotFound); }
      const savedImages = await store.image.filter({workspaceId: id})
      if (savedImages instanceof Error) { return savedImages }
      for(const img of savedImages){
        const err = await store.image.delete({id: img.id})
        if (err instanceof Error) { return err; }
      }
      let err = await store.workspace.delete({ id });
      if (err instanceof Error) { return err; }
      return id;
    });
  }

  return {
    filter,
    find,
    create,
    delete: delete_,
    update,
  }
}

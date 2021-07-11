import { v4 } from "uuid";
import { ErrorKind } from "@sivic/core/error"
import { Lock, Store } from ".";

export type Tag = {
  id: string,
  name: string,
  workspaceId?: string,
}

export const Tag = (args?: {
  id?:string;
  name?: string;
  workspaceId?: string
}):Tag => {
  const id = args?.id || v4()
  const name = args?.name || ""
  const workspaceId = args?.workspaceId
  return {
    id,
    name,
    workspaceId
  }
}

export type CreatePayload = {
  id?: string;
  name: string;
  workspaceId: string;
};

export type FindPayload = {
  id: string;
};

export type FilterPayload = {
  ids?: string[];
};

export type UpdatePayload = {
  id: string;
  name: string;
  workspaceId?: string;
};

export type DeletePayload = {
  id: string;
};

export type Service = {
  create: (payload: CreatePayload) => Promise<Tag | Error>;
  find: (payload: FindPayload) => Promise<Tag | Error>;
  filter: (payload: FilterPayload) => Promise<Tag[] | Error>;
  delete: (payload: DeletePayload) => Promise<string| Error>;
  update: (payload: UpdatePayload) => Promise<Tag | Error>;
};


export const Service = (args: { store: Store; lock: Lock }): Service => {
  const { store, lock } = args;
  const filter = async (payload: FilterPayload) => {
    return await store.workspace.filter(payload);
  };

  const find = async (payload: FindPayload) => {
    const tag = await store.tag.find(payload)
    if(tag instanceof Error) { return tag }
    if(tag === undefined){ 
      return new Error(ErrorKind.TagNotFound)
    }
    return tag
  };

  const checkUnique = async (tag: Tag) => {
    const row = await store.tag.find({
      name: tag.name,
      workspaceId: tag.workspaceId,
    })
    if(row instanceof Error){ return row }
    if(row !== undefined && row.id !== tag.id){
      return new Error(ErrorKind.TagAlreadyExist)
    }
  }

  const create = async (payload: CreatePayload) => {
    return await lock.auto(async () => {
      const { workspaceId, id, name } = payload
      const row = Tag({
        id,
        name,
        workspaceId,
      })
      const uniqueErr = await checkUnique(row)
      if(uniqueErr instanceof Error) { return uniqueErr}
      if(row instanceof Error) { return row }
      let err = await store.tag.insert(row);
      if (err instanceof Error) { return err; }
      return row;
    });
  };

  const update = async (payload: UpdatePayload) => {
    return await lock.auto(async () => {
      const tag = await find({id: payload.id})
      if(tag instanceof Error) {return tag}
      const uniqueErr = await checkUnique(tag)
      if(uniqueErr instanceof Error) { return uniqueErr}
      const newTag = Tag({
        ...tag,
        ...payload
      })

      let err = await store.tag.update(newTag);
      if (err instanceof Error) {
        return err;
      }
      return newTag;
    });
  };

  const delete_ = async (payload: DeletePayload) => {
    return await lock.auto(async () => {
      const tag = await find({id: payload.id})
      if(tag instanceof Error) { return tag }
      let err = await store.tag.delete({ id: payload.id });
      if (err instanceof Error) { return err; }
      return payload.id;
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

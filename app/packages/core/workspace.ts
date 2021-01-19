import { v4 as uuid } from 'uuid';
import { Lock, ErrorKind, Store } from ".";

export type Workspace = {
  id: string
  name: string
  createdAt: Date
}

export type WorkspaceImage = {
  workspaceId: string
  imageId: string
}

export type FilterPayload = {
  ids?: string[];
};

export type CreatePayload = {
  id?: string;
  name: string;
};

export type FindPayload = {
  id: string;
};

export type DeletePayload = {
  id: string;
};

export const Workspace = (args?: Workspace):Workspace => {
  return args || {
    id: uuid(),
    name: "",
    createdAt: new Date(),
  }
}

export type Service = {
  create: (payload: CreatePayload) => Promise<string | Error>;
  find: (payload: FindPayload) => Promise<Workspace | Error>;
  filter: (payload: FilterPayload) => Promise<Workspace[] | Error>;
  delete: (payload: DeletePayload) => Promise<string| Error>;
};

export const Service = (args: { store: Store; lock: Lock }): Service => {
  const { store, lock } = args;
  const filter = async (payload: FilterPayload) => {
    return await store.workspace.filter(payload);
  };
  const find = async (payload: FindPayload) => {
    const workspace = await store.workspace.find(payload);
    if (workspace instanceof Error) {
      return workspace;
    }
    if (workspace === undefined) {
      return new Error(ErrorKind.WorkspaceNotFound);
    }
    return workspace;
  };

  const create = async (payload: CreatePayload) => {
    return await lock.auto(async () => {
      const { name, id } = payload;
      const row = Workspace()
      row.id = id || row.id
      row.name = name
      const prev = await store.workspace.find({id: row.id});

      if(prev instanceof Error) {return prev}
      if(prev !== undefined) {
        return new Error(ErrorKind.WorkspaceAlreadyExist)
      }

      let err = await store.workspace.insert(row);
      if (err instanceof Error) {
        return err;
      }
      return row.id;
    });
  };
  const delete_ = async (payload: DeletePayload) => {
    return await lock.auto(async () => {
      const { id } = payload;
      const row = await store.workspace.find({ id });
      if (row instanceof Error) {
        return row;
      }
      if (row === undefined) {
        return new Error(ErrorKind.WorkspaceNotFound);
      }
      let err = await store.workspace.delete({ id });
      if (err instanceof Error) {
        return err;
      }
      return id;
    });
  };
  return {
    filter,
    find,
    create,
    delete: delete_,
  }
}

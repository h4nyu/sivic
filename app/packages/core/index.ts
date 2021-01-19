export { ErrorKind } from "./error";
import { Workspace } from "./workspace";

export type WorkspaceStore = {
  find: (payload: {id :string}) => Promise<Workspace | undefined | Error>;
  filter: (payload: {
    ids?: string[];
  }) => Promise<Workspace[] | Error>;
  insert: (payload: Workspace) => Promise<void | Error>;
  delete: (payload: {
    id: string;
  }) => Promise<void | Error>;
  clear: () => Promise<void | Error>;
};

export type Lock = {
  auto: <T>(fn: () => Promise<T>) => Promise<T>;
};

export type Store = {
  workspace: WorkspaceStore;
};

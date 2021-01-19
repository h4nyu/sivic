// export { ErrorKind } from "./error";
import { Workspace } from "./workspace";

export type WorkspaceStore = {
  filter: (payload: {
    workspaceId?: string;
  }) => Promise<Workspace[] | Error>;
  insert: (payload: Workspace) => Promise<void | Error>;
  delete: (payload: {
    workspaceId?: string;
  }) => Promise<void | Error>;
  clear: () => Promise<void | Error>;
};

export type Lock = {
  auto: <T>(fn: () => Promise<T>) => Promise<T>;
};

export type Store = {
  workspace: WorkspaceStore;
};

import { observable, computed } from "mobx";
import { Map, List } from "immutable";
import { Workspaces } from ".";
import { ToastStore } from "./toast";
import { LoadingStore } from "./loading";
import { RootApi } from "@sivic/api";
import {
  Workspace,
} from "@sivic/core/workspace";
import { saveAs } from 'file-saver';
import { MemoryRouter } from "react-router";
import { keyBy } from "lodash";
import { parseISO } from "date-fns";
import { Level } from "@sivic/web/store"
import { ImageForm } from "@sivic/web/store/ImageForm"

export type WorkspaceStore = {
  workspaces: Map<string, Workspace>;
  fetch: () => Promise<void>
};

export const WorkspaceStore = (args: {
  api: RootApi;
  loading: <T>(fn: () => Promise<T>) => Promise<T>;
  toast: ToastStore;
}): WorkspaceStore => {
  const { api, loading, toast } = args;
  const fetch = async () => {
    const workspaces = await api.workspace.filter({})
    if(workspaces instanceof Error) { return }
    self.workspaces = Map(keyBy(workspaces, x => x.id))
  }
  const self = observable({
    workspaces: Map<string, Workspace>(),
    fetch,
  })
  return self
}
export default WorkspaceStore

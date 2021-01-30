import { DataStore } from "./data";
import { LoadingStore } from "./loading";
import { ToastStore } from "./toast";
import { RootApi } from "@sivic/api";
import { configure } from "mobx";
import { Map, List } from "immutable";
import { createHashHistory } from "history";
import { Workspace } from "@sivic/core/workspace";
import WorkspaceForm from "@sivic/web/store/WorkspaceForm"

configure({
  enforceActions: "never",
});

export type Workspaces = List<Workspace>;

export enum Level {
  Info,
  Success,
  Warning,
  Error,
}
export type LoadingFn =  <T>(fn: () => Promise<T>) => Promise<T>;

export type History = {
  push: (name: string) => void;
  goBack: () => void;
};

export type RootStore = {
  data: DataStore;
  loading: LoadingStore;
  toast: ToastStore;
  history: History;
  api: RootApi;
  workspaceForm: WorkspaceForm;
  init: () => Promise<void>;
};
export const RootStore = (): RootStore => {
  const api = RootApi();
  const loading = LoadingStore();
  const toast = ToastStore();
  const data = DataStore({ api, loading:loading.loading, toast });
  const history = createHashHistory();

  const init = async () => {
    await data.init();
    toast.show("Success", Level.Success);
  };
  const workspaceForm = WorkspaceForm({
    api,
    loading:loading.loading,
    toast,
    onInit: () => {
      history.push("/workspace")
    }
  })

  return {
    api,
    data,
    toast,
    loading,
    init,
    history,
    workspaceForm,
  };
};

export default RootStore();

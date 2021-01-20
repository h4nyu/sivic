import { DataStore } from "./data";
import { LoadingStore } from "./loading";
import { ToastStore } from "./toast";
import { RootApi } from "@sivic/api";
import { configure } from "mobx";
import { Map, List } from "immutable";
import { createHashHistory } from "history";
import { Workspace } from "@sivic/core/workspace";
export { Workspace } from "@sivic/core/workspace";

configure({
  enforceActions: "never",
});

export type Workspaces = Map<string, Workspace>;

export enum Level {
  Info,
  Success,
  Warning,
  Error,
}

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

  return {
    api,
    data,
    toast,
    loading,
    init,
    history,

  };
};

export default RootStore();

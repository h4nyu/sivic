import { DataStore } from "./data";
import { LoadingStore } from "./loading";
import { ToastStore } from "./toast";
// import { RootApi, DetectionApi } from "@charpoints/api";
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
  loading: LoadingStore;
  toast: ToastStore;
  history: History;
  // api: RootApi;
  init: () => Promise<void>;
};
export const RootStore = (): RootStore => {
  // const api = RootApi();
  const loading = LoadingStore();
  const toast = ToastStore();
  const history = createHashHistory();

  const init = async () => {
    // await data.init();
    // const url = await api.detectionUrl();
    // if (url instanceof Error) {
    //   return;
    // }
    // detectionApi.setUrl(url);
    // toast.show("Success", Level.Success);
  };
  return {
    // api,
    toast,
    loading,
    init,
    history,

  };
};

export default RootStore();

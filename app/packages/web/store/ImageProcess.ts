import { observable, computed } from "mobx";
import { Map, List } from "immutable";
import { Workspaces } from ".";
import { ToastStore } from "./toast";
import { LoadingStore } from "./loading";
import { RootApi } from "@sivic/api";
import { RootApi as ImageApi } from "@charpoints/api";
import { Workspace } from "@sivic/core/workspace";
import { Image } from "@charpoints/core/image"
import { saveAs } from 'file-saver';
import { MemoryRouter } from "react-router";
import { take, flow, sortBy, map } from "lodash/fp";
import { parseISO } from "date-fns";
import { Level } from "@sivic/web/store"
import { readAsBase64, b64toBlob } from "@charpoints/web/utils";
import { Images } from "@charpoints/web/store";

export type State = {
  image?: Image;
};

export type ImageProcess = {
  state: State;
  init: (workspaceId:string, imageId:string) => Promise<void>;
};

const State = ():State => {
  return {
  };
};

export const ImageProcess = (args: {
  api: RootApi;
  imageApi: ImageApi;
  loading: <T>(fn: () => Promise<T>) => Promise<T>;
  toast: ToastStore;
  onInit?: (workspaceId:string, imageId:string) => void
}): ImageProcess => {
  const { api, imageApi, loading, toast, onInit } = args;
  const state = observable(State());

  const init = async (workspaceId:string, imageId:string) => {
    onInit && onInit(workspaceId, imageId)
  }

  return {
    state,
    init,
  }
};
export default ImageProcess 

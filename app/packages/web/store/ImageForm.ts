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
  workspace?:Workspace
  images: Image[];
};

export type ImageForm = {
  state: State;
  init: (workspace:Workspace) => Promise<void>;
  uploadFiles: (files:File[]) => Promise<void>;
};

const State = ():State => {
  return {
    images: [],
  };
};

export const ImageForm = (args: {
  api: RootApi;
  imageApi: ImageApi;
  loading: <T>(fn: () => Promise<T>) => Promise<T>;
  toast: ToastStore;
}): ImageForm => {
  const { api, imageApi, loading, toast } = args;
  const state = observable(State());

  const reset = () => {
    // const {id, name } = State()
    // state.id = id
    // state.name = name
  }

  const init = async (workspace:Workspace) => {
    state.workspace = workspace
    const { imageIds } = workspace
    const images = await imageApi.image.filter({ids:imageIds})
    if(images instanceof Error) {
      toast.error(images)
      return
    }
    state.images = images
  }

  const uploadFiles = async (files: File[]) => {
    const ids: string[] = [];
    const workspaceId = state.workspace?.id
    if(workspaceId === undefined){
      return
    }

    await loading(async () => {
      for (const f of files) {
        if (!f.type.includes("image")) {
          toast.error(Error("UnsupportedFormat"));
          continue;
        }
        const data = await readAsBase64(f);
        if (data instanceof Error) {
          toast.error(data);
          continue;
        }
        const imageId = await imageApi.image.create({ data, name:f.name });
        if (imageId instanceof Error) {
          toast.error(imageId);
          continue;
        }
        let addErr = api.workspace.addImage({workspaceId, imageId})
        if(addErr instanceof Error){ 
          toast.error(addErr)
          continue 
        }
      }
    });
  };

  return {
    state,
    init,
    uploadFiles,
  }
};
export default ImageForm 

import { observable, computed } from "mobx";
import { Map, List } from "immutable";
import { Workspaces } from ".";
import { ToastStore } from "./toast";
import { LoadingStore } from "./loading";
import { RootApi } from "@sivic/api";
import { RootApi as ImageApi } from "@charpoints/api";
import {
  Workspace,
} from "@sivic/core/workspace";
import { saveAs } from 'file-saver';
import { MemoryRouter } from "react-router";
import { take, flow, sortBy, map } from "lodash/fp";
import { parseISO } from "date-fns";
import { Level } from "@sivic/web/store"
import { readAsBase64, b64toBlob } from "@charpoints/web/utils";
import { Images } from "@charpoints/web/store";

export type State = {
  images: Images;
};

export type ImageForm = {
  state: State;
  init: (id?:string) => Promise<void>;
  uploadFiles: (files:File[]) => Promise<void>;
};

const State = ():State => {
  return {
    images: List()
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

  const init = async (id?:string) => {

  }

  const uploadFiles = async (files: File[]) => {
    const ids: string[] = [];
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
        const id = await imageApi.image.create({ data, name:f.name });
        if (id instanceof Error) {
          toast.error(id);
          continue;
        }
        // await fetchImage(id);
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

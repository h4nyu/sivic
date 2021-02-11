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
  deleteImage: (imageId:string) => Promise<void|Error>;
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
  onSave?: (workspaceId:string) => void
}): ImageForm => {
  const { api, imageApi, loading, toast, onSave } = args;
  const state = observable(State());

  const reset = () => {
    // const {id, name } = State()
    // state.id = id
    // state.name = name
  }
  const fetch = async () => {
    const { workspace } = state
    if(workspace === undefined){
      return
    }
    const { imageIds } = workspace
    const images = await imageApi.image.filter({ids:imageIds})
    if(images instanceof Error) {
      toast.error(images)
      return
    }
    state.images = images
  }

  const init = async (workspace:Workspace) => {
    state.workspace = workspace
    await fetch()
  }

  const deleteImage = async (imageId:string) => {
    const workspaceId = state.workspace?.id
    if(workspaceId === undefined) { return}
    let err = await api.workspace.deleteImage({
      workspaceId,
      imageId,
    })
    if(err instanceof Error) {
      toast.error(err)
      return err
    }
    const imErr = await imageApi.image.delete({id:imageId})
    if(imErr instanceof Error) { 
      toast.error(imErr)
      return err 
    }
    onSave && onSave(workspaceId)
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
        let addErr = await api.workspace.addImage({workspaceId, imageId})
        if(addErr instanceof Error){ 
          toast.error(addErr)
          continue 
        }
      }
    });
    onSave && onSave(workspaceId)
  };

  return {
    state,
    init,
    deleteImage,
    uploadFiles,
  }
};
export default ImageForm 

import { observable, computed } from "mobx";
import { Map, List } from "immutable";
import { Workspaces } from ".";
import { ToastStore } from "./toast";
import { LoadingStore } from "./loading";
import { RootApi } from "@sivic/api";
import { Workspace } from "@sivic/core/workspace";
import { Image, } from "@sivic/core/image";
import { saveAs } from 'file-saver';
import { MemoryRouter } from "react-router";
import { take, flow, sortBy, map } from "lodash/fp";
import { parseISO } from "date-fns";
import { Level } from "@sivic/web/store"
import { ImageForm } from "@sivic/web/store/ImageForm"
import { ImageStore } from "@sivic/web/store/ImageStore"
import { BoxStore } from "@sivic/web/store/BoxStore"


export type WorkspaceFrom = {
  id: string,
  name: string,
  imageForm: ImageForm,
  rootImages: Map<string, Image>,
  create: () => void;
  update: (id:string) => void;
  setName: (value:string) => void;
  save: () => Promise<void>;
  delete: (id:string) => Promise<void>;
};

export const WorkspaceFrom = (args: {
  api: RootApi;
  loading: <T>(fn: () => Promise<T>) => Promise<T>;
  toast: ToastStore;
  imageForm: ImageForm;
  imageStore: ImageStore;
  boxStore:BoxStore;
  onInit?: (workspace:Workspace) => void;
  onCreate?:() => void;
  onSave?: (workspace:Workspace) => void;
  onDelete?: (id:string) => void;
}): WorkspaceFrom => {
  const { api, loading, toast, onInit, onSave, onDelete, imageForm, imageStore, boxStore, onCreate } = args;
  const reset = () => {
    self.id = ""
    self.name = ""
  }
  const create = async () => {
    reset()
    onCreate && onCreate()
  }
  const update = async (workspaceId:string) => {
    await loading(async () => {
      const row = await api.workspace.find({id: workspaceId})
      if(row instanceof Error) {
        return row
      }
      self.id = row.id
      self.name = row.name
      await imageForm.init(row)
      await imageStore.fetch({workspaceId})
      const imageIds = imageStore.images.filter(x => x.parentId === undefined).toList()
      for (const image of imageIds){
        await boxStore.fetch(image.id)
      }
      onInit && onInit(row)
    })
  }

  const getRootImages = () => {
    return imageStore.images
    .filter(x => x.workspaceId === self.id && x.parentId === undefined)
  }

  const setName = (value:string) => {
    self.name = value
  }

  const save = async ():Promise<void> => {
    await loading(async () => {
      const row = await api.workspace.create({name:self.name});
      if (row instanceof Error) {
        toast.error(row)
        return;
      }
      onSave && onSave(row)
      toast.show("Success", Level.Success);
    })
  }

  const _delete = async (id:string):Promise<void> => {
    await loading(async () => {
      const row = await api.workspace.delete({id});
      if (row instanceof Error) {
        return;
      }
      onDelete && onDelete(row)
      toast.show("Success", Level.Success);
    })
  }

  const self = observable({
    id:"", 
    name:"",
    imageForm,
    create,
    update,
    setName,
    save,
    get rootImages() { return getRootImages() },
    delete: _delete
  })
  return self
};
export default WorkspaceFrom

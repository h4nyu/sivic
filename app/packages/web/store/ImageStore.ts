import { observable, computed } from "mobx";
import { Map, List } from "immutable";
import { Images } from ".";
import { ToastStore } from "./toast";
import { LoadingStore } from "./loading";
import { RootApi } from "@sivic/api";
import { Image, FilterPayload } from "@sivic/core/image";
import { saveAs } from 'file-saver';
import { MemoryRouter } from "react-router";
import { parseISO } from "date-fns";
import { Level } from "@sivic/web/store"
import { ImageForm } from "@sivic/web/store/ImageForm"

export type ImageStore = {
  images: Map<string, Image>;
  fetch: (payload:FilterPayload) => Promise<void>
  delete: (payload: {
    parentId?: string,
    workspaceId?:string, 
    ids?:string[]
  }) => void
};

export const ImageStore = (args: {
  api: RootApi;
  loading: <T>(fn: () => Promise<T>) => Promise<T>;
  toast: ToastStore;
}): ImageStore => {
  const { api, loading, toast } = args;
  const fetch = async (payload: FilterPayload) => {
    const images = await api.image.filter(payload)
    if(images instanceof Error) { return }
    self.images = self.images.merge(Map(images.map(x => [x.id, x])))
  }
  const delete_ = (payload:{
    workspaceId?: string,
    parentId?: string,
    ids?: string[]
  }) => {
    const { ids, workspaceId, parentId } = payload
    if(workspaceId !== undefined){
      self.images = self.images.filter(x => x.workspaceId !== workspaceId)
    }else if(ids) {
      self.images = self.images.filter(x => !(ids.includes(x.id) || ids.includes(x.parentId || "")))
    }else if(parentId) {
      self.images = self.images.filter(x => x.parentId !== parentId)
    }
  }
  const self = observable({
    images: Map<string, Image>(),
    fetch,
    delete: delete_
  })
  return self
}
export default ImageStore

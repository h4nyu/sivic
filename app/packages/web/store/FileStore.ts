import { observable, computed } from "mobx";
import { Map, List } from "immutable";
import { ToastStore } from "./toast";
import { LoadingStore } from "./loading";
import { RootApi } from "@sivic/api";
import { File, FilterPayload } from "@sivic/core/file";
import { saveAs } from 'file-saver';
import { MemoryRouter } from "react-router";
import { parseISO } from "date-fns";
import { Level } from "@sivic/web/store"

export type FileStore = {
  files: Map<string, File>;
  fetch: (payload:FilterPayload) => Promise<void>
  delete: (payload: {
    parentId?: string,
    workspaceId?:string, 
    ids?:string[]
  }) => void
};

export const FileStore = (args: {
  api: RootApi;
  loading: <T>(fn: () => Promise<T>) => Promise<T>;
  toast: ToastStore;
}): FileStore => {
  const { api, loading, toast } = args;
  const fetch = async (payload: FilterPayload) => {
    const files = await api.file.filter(payload)
    if(files instanceof Error) { return }
    self.files = self.files.merge(Map(files.map(x => [x.id, x])))
  }
  const delete_ = (payload:{
    id:string
  }) => {
    self.files = self.files.filter(x => x.id !== id)
  }
  const self = observable({
    files: Map<string, File>(),
    fetch,
    delete: delete_
  })
  return self
}
export default FileStore


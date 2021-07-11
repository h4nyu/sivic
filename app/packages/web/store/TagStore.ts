import { observable, computed } from "mobx";
import { Tag } from "@sivic/core/tag";
import { Map, List } from "immutable";
import { Images } from ".";
import { ToastStore } from "./toast";
import { LoadingStore } from "./loading";
import { RootApi } from "@sivic/api";
import {
  Image,
} from "@sivic/core/image";
import { saveAs } from 'file-saver';
import { keyBy } from "lodash";

export type TagStore = {
  tags: Map<string, Tag>;
  fetch: (imageId:string) => Promise<void>
};

export const TagStore = (args: {
  api: RootApi;
  loading: <T>(fn: () => Promise<T>) => Promise<T>;
  toast: ToastStore;
}): TagStore => {
  const { api, loading, toast } = args;
  const fetch = async (imageId:string) => {
    const tags = await api.tag.filter({imageId})
    if(tage instanceof Error) { return }
    self.tags = self.tags.merge(Map(keyBy(tags, x => x.id)))
  }
  const self = observable({
    tags: Map<string, Tag>(),
    fetch,
  })
  return self
}

export default TagStore 

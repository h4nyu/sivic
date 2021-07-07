import { observable, computed } from "mobx";
import { Map, List } from "immutable";
import { ToastStore } from "./toast";
import { LoadingStore } from "./loading";
import { RootApi } from "@sivic/api";
import {
  Tag,
  FilterPayload,
} from "@sivic/core/tag";
import { keyBy } from "lodash";

export type LineStore = {
  tags: Map<string, Tag>;
  fetch: (payload: FilterPayload) => Promise<void>
};

export const LineStore = (args: {
  api: RootApi;
}): LineStore => {
  const { api } = args;
  const fetch = async (payload:FilterPayload) => {
    const tags = await api.tag.filter(payload)
    if(tags instanceof Error) { return }
    self.tags = self.tags.merge(Map(keyBy(tags, x => x.id)))
  }
  const self = observable({
    tags: Map<string, Tag>(),
    fetch,
  })
  return self
}

export default LineStore 

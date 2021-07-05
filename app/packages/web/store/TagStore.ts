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
    // const lines = await api.line.filter(payload)
    // if(lines instanceof Error) { return }
    // self.lines = self.lines.merge(Map(keyBy(lines, x => x.id)))
  }
  const self = observable({
    tags: Map<string, Tag>(),
    fetch,
  })
  return self
}

export default LineStore 

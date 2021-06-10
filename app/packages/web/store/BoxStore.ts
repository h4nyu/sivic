import { observable, computed } from "mobx";
import { Box } from "@charpoints/core/box";
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

export type BoxStore = {
  boxes: Map<string, Box>;
  fetch: (imageId:string) => Promise<void>
};

export const BoxStore = (args: {
  api: RootApi;
  loading: <T>(fn: () => Promise<T>) => Promise<T>;
  toast: ToastStore;
}): BoxStore => {
  const { api, loading, toast } = args;
  const fetch = async (imageId:string) => {
    const boxes = await api.box.filter({imageId})
    if(boxes instanceof Error) { return }
    self.boxes = self.boxes.merge(Map(keyBy(boxes, x => x.id)))
  }
  const self = observable({
    boxes: Map<string, Box>(),
    fetch,
  })
  return self
}

export default BoxStore 

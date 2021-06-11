import { observable, computed } from "mobx";
import { Map, List } from "immutable";
import { Images } from ".";
import { ToastStore } from "./toast";
import { LoadingStore } from "./loading";
import { RootApi } from "@sivic/api";
import { Image, FilterPayload } from "@sivic/core/image";
import { saveAs } from 'file-saver';
import { MemoryRouter } from "react-router";
import { keyBy } from "lodash";
import { parseISO } from "date-fns";
import { Level } from "@sivic/web/store"
import { readAsBase64, b64toBlob } from "@charpoints/web/utils";
import { ImageForm } from "@sivic/web/store/ImageForm"

export type ImageStore = {
  images: Map<string, Image>;
  fetch: (payload:FilterPayload) => Promise<void>
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
    self.images = Map(keyBy(images, x => x.id))
  }
  const self = observable({
    images: Map<string, Image>(),
    fetch,
  })
  return self
}
export default ImageStore

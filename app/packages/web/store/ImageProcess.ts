import { observable, computed } from "mobx";
import { Map, List } from "immutable";
import { v4 as uuid } from "uuid";
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
import { Box } from "@charpoints/web/store";
import Editor from "@sivic/web/store/BoxEditor"

export type ImageProcess = {
  image?: Image;
  lineWidth: number;
  init: (workspaceId:string, imageId:string) => Promise<void|Error>;
  fetchBoxes: () => void;
};

export const ImageProcess = (args: {
  api: RootApi;
  loading: <T>(fn: () => Promise<T>) => Promise<T>;
  toast: ToastStore;
  onInit?: (workspaceId:string, imageId:string) => void
  editor: Editor
}): ImageProcess => {
  const { api, loading, toast, onInit, editor } = args;

  const init = async (workspaceId:string, imageId:string) => {
    await loading(async () => {
      const image = await api.image.find({id:imageId, hasData:true})
      if(image instanceof Error) { return image }
      editor.boxes = Map()
      self.image = image
      onInit && onInit(workspaceId, imageId)
    })
  }

  const fetchBoxes = async () => {
    const { image } = self
    if(image === undefined) { return }
    const { data } = image
    if(data === undefined) { return}
    await loading(async () => {
      const boxes = await api.detect.box({data})
      if(boxes instanceof Error) { return boxes }
      editor.boxes = Map(boxes.map(x => {
        return [uuid(), x]
      }))
      editor.boxes = editor.boxes.sortBy(x => x.confidence)
    })
  }

  const self = observable<ImageProcess>({
    image: undefined,
    lineWidth: 10,
    init,
    fetchBoxes,
  })
  return self
};
export default ImageProcess 

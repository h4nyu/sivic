import { LoadingStore } from "./loading";
import { ToastStore } from "./toast";
import { RootApi } from "@sivic/api";
import { configure } from "mobx";
import { Map, List } from "immutable";
import { createHashHistory } from "history";
import { Workspace } from "@sivic/core/workspace";
import { Image } from "@sivic/core/image";
import WorkspaceForm from "@sivic/web/store/WorkspaceForm"
import { WorkspaceStore } from "@sivic/web/store/WorkspaceStore"
import { ImageStore } from "@sivic/web/store/ImageStore"
import { BoxStore } from "@sivic/web/store/BoxStore"
import ImageForm from "@sivic/web/store/ImageForm"
import ImageProcess from "@sivic/web/store/ImageProcess"
import Editor from "@sivic/web/store/BoxEditor"
import PointEditor from "@sivic/web/store/PointEditor"
import LineEditor from "@sivic/web/store/LineEditor"
import PointStore from "@sivic/web/store/PointStore"
import FileStore from "@sivic/web/store/FileStore"
import LineStore from "@sivic/web/store/LineStore"

configure({
  enforceActions: "never",
});

export type Workspaces = List<Workspace>;
export type Images = List<Image>;
export enum Level {
  Info,
  Success,
  Warning,
  Error,
}
export type LoadingFn =  <T>(fn: () => Promise<T>) => Promise<T>;

export type History = {
  push: (name: string) => void;
  goBack: () => void;
};

export type RootStore = {
  workspaceStore: WorkspaceStore;
  imageStore: ImageStore;
  boxStore:BoxStore;
  loadingStore: LoadingStore;
  lineStore: LineStore,
  editor: Editor;
  pointEditor: PointEditor;
  lineEditor: LineEditor;
  toast: ToastStore;
  history: History;
  api: RootApi;
  workspaceForm: WorkspaceForm;
  imageForm: ImageForm;
  imageProcess: ImageProcess;
  pointStore: PointStore;
  fileStore: FileStore;
  init: () => Promise<void>;
};
export const RootStore = (): RootStore => {
  const api = RootApi();
  const loadingStore = LoadingStore();
  const loading = loadingStore.loading;
  const toast = ToastStore();
  const lineStore = LineStore({api})
  const fileStore = FileStore({api})
  const workspaceStore = WorkspaceStore({ api, loading, toast });
  const imageStore = ImageStore({ api, loading, toast})
  const pointStore = PointStore({ api })
  const boxStore = BoxStore({ api, loading, toast})
  const history = createHashHistory();
  const editor = Editor({ api, loading, toast })

  const lineEditor = LineEditor({ 
    api, 
    lineStore,
    loading, 
    toast,
  })

  const pointEditor = PointEditor({ 
    api, 
    loading, 
    toast,
    pointStore,
    imageStore,
    lineEditor,
    onInit: (id) => {
      history.push(`/point`)
    },
  })

  const init = async () => {
    await workspaceStore.fetch();
    toast.show("Success", Level.Success);
  };

  const imageForm = ImageForm({
    api,
    loading,
    toast,
    imageStore,
    onSave: async (workspaceId:string) => {
      workspaceForm.update(workspaceId)
    }
  })
  const imageProcess = ImageProcess({
    api,
    loading,
    toast,
    imageStore,
    onInit: (imageId) => {
      history.push(`/workspace/id/${workspaceForm.id}/image-id/${imageId}`)
    },
    editor,
  })
  const workspaceForm = WorkspaceForm({
    api,
    loading,
    toast,
    imageForm,
    imageStore,
    boxStore,
    fileStore,
    onInit: (workspace) => {
      history.push(`/workspace/id/${workspace.id}`)
    },
    onCreate: () => {
      history.push(`/workspace/create`)
    },
    onSave: (workspace) => {
      workspaceStore.fetch()
    },
    onDelete: (id:string) => {
      workspaceStore.fetch()
    }
  })

  return {
    api,
    workspaceStore,
    toast,
    loadingStore,
    editor,
    pointEditor,
    lineEditor,
    init,
    history,
    workspaceForm,
    imageStore,
    boxStore,
    pointStore,
    imageForm,
    imageProcess,
    lineStore,
    fileStore,
  };
};

export default RootStore();

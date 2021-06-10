export { ErrorKind } from "./error";
import { Workspace } from "./workspace";
import { Image } from "@sivic/core/image"
import { Box } from "@charpoints/core/box"
import { Point } from "@charpoints/core/point"
import { Box as CharBox } from "@charpoints/core/box"
import { CropPayload } from "@charpoints/core/transform"

export type WorkspaceStore = {
  find: (payload: {id :string}) => Promise<Workspace | undefined | Error>;
  filter: (payload: {
    ids?: string[];
  }) => Promise<Workspace[] | Error>;
  insert: (payload: Workspace) => Promise<void | Error>;
  update: (payload: Workspace) => Promise<void | Error>;
  delete: (payload: {
    id: string;
  }) => Promise<void | Error>;
  clear: () => Promise<void | Error>;
};

export type ImageStore = {
  find: (payload: {id :string, hasData?:boolean}) => Promise<Image | Error>;
  filter: (payload:{workspaceId :string}) => Promise<Image[] | Error>
  insert: (payload: Image ) => Promise<void | Error>
  update: (payload: Image ) => Promise<void | Error>
  delete: (payload: { id: string} ) => Promise<void | Error>
};

export type DetectStore = {
  box: (payload: {data :string}) => Promise<Box[] | Error>;
};

export type BoxStore = {
  filter: (payload: {imageId?: string;}) => Promise<Box[] | Error>;
  replace: (payload: {imageId: string, boxes:Box[]}) => Promise<void | Error>;
};

export type PointStore = {
  filter: (payload: {imageId?: string;}) => Promise<Point[] | Error>;
  replace: (payload: {imageId: string, points:Point[]}) => Promise<void | Error>;
};

export type TransformStore = {
  crop: (payload: CropPayload) => Promise<string | Error>;
};

export type Lock = {
  auto: <T>(fn: () => Promise<T>) => Promise<T>;
};

export type Store = {
  workspace: WorkspaceStore;
  transform: TransformStore;
  image: ImageStore,
  detect: DetectStore,
  box:BoxStore,
  point: PointStore
};

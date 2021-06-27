export { ErrorKind } from "./error";
import { Workspace } from "./workspace";
import { Image } from "@sivic/core/image"
import { Box } from "@sivic/core/box"
import { Point } from "@charpoints/core/point"
import { CropPayload } from "@charpoints/core/transform"
import { Line } from "@sivic/core/line";

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
  filter: (payload:{workspaceId? :string, parentId?: string, ids?: string[]}) => Promise<Image[] | Error>
  insert: (payload: Image ) => Promise<void | Error>
  update: (payload: Image ) => Promise<void | Error>
  delete: (payload: { id: string} ) => Promise<void | Error>
};

export type DetectStore = {
  box: (payload: {data :string}) => Promise<Box[] | Error>;
};

export type BoxStore = {
  filter: (payload: {imageId?: string;}) => Promise<Box[] | Error>;
  load: (payload: Box[]) => Promise<void | Error>;
  delete: (payload: {imageId?: string}) => Promise<void | Error>;
};

export type PointStore = {
  filter: (payload: {imageId?: string;}) => Promise<Point[] | Error>;
  replace: (payload: {imageId: string, points:Point[]}) => Promise<void | Error>;
};

export type LineStore = {
  filter: (payload: {imageId: string;}) => Promise<Line[] | Error>;
  delete: (payload: {imageId: string}) => Promise<void | Error>
  load: (payload: Line[]) => Promise<void | Error>;
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
  point: PointStore,
  line: LineStore,
}

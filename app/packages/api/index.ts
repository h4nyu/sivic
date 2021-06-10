import { WorkspaceApi } from "./workspace";
import { ImageApi } from "./image";
import { DetectApi } from "./detect";
import { BoxApi } from "./box";
import { PointApi } from "./point";
import { TransformApi } from "./transform";
import axios from "axios";

export function toError(err: any): Error {
  const message = err.response?.data?.message;
  if (message) {
    return new Error(message);
  } else {
    return new Error(err.message);
  }
}

export type RootApi = {
  setUrl: (url: string) => void;
  getImageStoreUrl: () => Promise<string|Error>;
  workspace: WorkspaceApi;
  image: ImageApi;
  detect: DetectApi;
  box: BoxApi;
  point: PointApi;
  transform: TransformApi;
};

export const RootApi = (): RootApi => {
  const http = axios.create();
  const prefix = "api/v1";
  const workspace = WorkspaceApi({ http, prefix: `${prefix}/workspace` });
  const image = ImageApi({ http, prefix: `${prefix}/image` });
  const detect = DetectApi({ http, prefix: `${prefix}/detect` });
  const box = BoxApi({ http, prefix: `${prefix}/box` });
  const point = PointApi({ http, prefix: `${prefix}/point` });
  const transform = TransformApi({ http, prefix: `${prefix}/transform` });

  const setUrl = (url: string) => {
    http.defaults.baseURL = url;
  };

  const getImageStoreUrl = async () => {
    try {
      const res = await http.get(`${prefix}/image-store-url`);
      return res.data;
    } catch (err) {
      return toError(err);
    }
  };
  return {
    setUrl,
    getImageStoreUrl,
    workspace,
    image,
    detect,
    box,
    point,
    transform,
  };
};

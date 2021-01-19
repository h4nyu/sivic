import { WorkspaceApi } from "./workspace";
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
  workspace: WorkspaceApi;
};

export const RootApi = (): RootApi => {
  const http = axios.create();
  const prefix = "api/v1";
  const workspace = WorkspaceApi({ http, prefix: `${prefix}/workspace` });

  const setUrl = (url: string) => {
    http.defaults.baseURL = url;
  };
  return {
    setUrl,
    workspace,
  };
};

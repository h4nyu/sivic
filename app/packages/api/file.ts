import { AxiosInstance } from "axios";
import { toError } from ".";
import {
  File,
  FindPayload,
  CreatePayload,
  Service,
} from "@sivic/core/file";

export type FileApi = Service;

export const FileApi = (arg: {
  http: AxiosInstance;
  prefix: string;
}): Service => {
  const { http, prefix } = arg;
  const find = async (payload: FindPayload) => {
    try {
      const res = await http.post(`${prefix}/find`, payload);
      return File(res.data);
    } catch (err) {
      return toError(err);
    }
  };

  const create = async (payload: CreatePayload) => {
    try {
      const res = await http.post(`${prefix}/replace`, payload);
    } catch (err) {
      return toError(err);
    }
  };

  return {
    filter,
    create,
  };
};
export default FileApi

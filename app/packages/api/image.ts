import { AxiosInstance } from "axios";
import { toError } from ".";
import {
  CreatePayload,
  DeletePayload,
  FindPayload,
  Service,
  Image,
} from "@sivic/core/image";
import { parseISO } from "date-fns";

export type ImageApi = Service;

export const ImageApi = (arg: {
  http: AxiosInstance;
  prefix: string;
}): Service => {
  const { http, prefix } = arg;
  const to = (res: any) => {
    return {
      ...res,
      createdAt: new Date(res.createdAt),
    };
  };


  const find = async (payload: FindPayload) => {
    try {
      const res = await http.post(`${prefix}/find`, payload);
      return to(res.data);
    } catch (err) {
      return toError(err);
    }
  };
  const create = async (payload: CreatePayload) => {
    try {
      const res = await http.post(`${prefix}/create`, payload);
      return to(res.data);
    } catch (err) {
      return toError(err);
    }
  };

  const delete_ = async (payload: DeletePayload) => {
    try {
      const res = await http.post(`${prefix}/delete`, payload);
      return res.data;
    } catch (err) {
      return toError(err);
    }
  };

  return {
    create,
    find,
    delete: delete_,
  };
};

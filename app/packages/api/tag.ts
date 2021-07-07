import { AxiosInstance } from "axios";
import { toError } from ".";
import {
  FilterPayload,
  DeletePayload,
  CreatePayload,
  Service,
} from "@sivic/core/tag";

export type TagApi = Service;

export const TagApi = (arg: {
  http: AxiosInstance;
  prefix: string;
}): Service => {
  const { http, prefix } = arg;
  const filter = async (payload: FilterPayload) => {
    try {
      const res = await http.post(`${prefix}/filter`, payload);
      return res.data;
    } catch (err) {
      return toError(err);
    }
  };
  const create = async (payload: CreatePayload) => {
    try {
      const res = await http.post(`${prefix}/create`, payload);
      return res.data;
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
    filter,
    delete: delete_,
  };
};

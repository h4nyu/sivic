import { AxiosInstance } from "axios";
import { toError } from ".";
import {
  Tag,
  FilterPayload,
  FindPayload,
  DeletePayload,
  UpdatePayload,
  CreatePayload,
  Service,
} from "@sivic/core/tag";

export type TagApi = Service;

export const TagApi = (arg: {
  http: AxiosInstance;
  prefix: string;
}): Service => {
  const { http, prefix } = arg;
  const create = async (payload: CreatePayload) => {
    try {
      const res = await http.post(`${prefix}/create`, payload);
      return Tag(res.data)
    } catch (err) {
      return toError(err);
    }
  };


  const update = async (payload: UpdatePayload) => {
    try {
      const res = await http.post(`${prefix}/update`, payload);
      return Tag(res.data)
    } catch (err) {
      return toError(err);
    }
  };

  const filter = async (payload: FilterPayload) => {
    try {
      const res = await http.post(`${prefix}/filter`, payload);
      return res.data.map(x => Tag(x));
    } catch (err) {
      return toError(err);
    }
  };

  const find = async (payload: FindPayload) => {
    try {
      const res = await http.post(`${prefix}/find`, payload);
      return Tag(res.data)
    } catch (err) {
      return toError(err);
    }
  };

  const delete_ = async (payload: DeletePayload) => {
    try {
      const res = await http.post(`${prefix}/delete`, payload);
      return res.data
    } catch (err) {
      return toError(err);
    }
  };

  return {
    filter,
    find,
    delete: delete_,
    create,
    update,
  };
};
export default TagApi

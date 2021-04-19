import { AxiosInstance } from "axios";
import { toError } from ".";
import {
  FilterPayload,
  ReplacePayload,
  Service,
} from "@sivic/core/point";

export type PointApi = Service;

export const PointApi = (arg: {
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

  const replace = async (payload: ReplacePayload) => {
    try {
      const res = await http.post(`${prefix}/replace`, payload);
    } catch (err) {
      return toError(err);
    }
  };

  return {
    filter,
    replace,
  };
};

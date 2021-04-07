import { AxiosInstance } from "axios";
import { toError } from ".";
import {
  FilterPayload,
  AnnotatePayload,
  Service,
} from "@sivic/core/box";

export type BoxApi = Service;

export const BoxApi = (arg: {
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

  const annotate = async (payload: AnnotatePayload) => {
    try {
      const res = await http.post(`${prefix}/annotate`, payload);
    } catch (err) {
      return toError(err);
    }
  };

  return {
    filter,
    annotate,
  };
};

import { AxiosInstance } from "axios";
import { toError } from ".";
import {
  CropPayload,
  Service,
} from "@sivic/core/transform";

export type TransformApi = Service;

export const TransformApi = (arg: {
  http: AxiosInstance;
  prefix: string;
}): Service => {
  const { http, prefix } = arg;

  const crop = async (payload: CropPayload) => {
    try {
      const res = await http.post(`${prefix}/crop`, payload);
      return res.data;
    } catch (err) {
      return toError(err);
    }
  };

  return {
    crop,
  };
};

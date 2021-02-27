import { AxiosInstance } from "axios";
import { toError } from ".";
import {
  Service,
} from "@sivic/core/image";
import { parseISO } from "date-fns";

export type ImageApi = Service;

// export const DetectApi = (arg: {
//   http: AxiosInstance;
//   prefix: string;
// }): Service => {
//   const { http, prefix } = arg;
//   const to = (res: any) => {
//     return {
//       ...res,
//     };
//   };
//   const box = async (payload: DetectPayload) => {
//     try {
//       const res = await http.post(`${prefix}/box`, payload);
//       return to(res.data);
//     } catch (err) {
//       return toError(err);
//     }
//   };

//   return {
//     box,
//   };
// };

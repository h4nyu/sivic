import { v4 as uuid } from 'uuid';
import { Lock, ErrorKind, Store } from ".";
import { uniq } from "lodash"
import { Box } from "@charpoints/core/box"

export type DetectPayload = {
  data: string; //base64
};

export type Service = {
  box: (payload: DetectPayload) => Promise<Box | Error>;
};

export const Service = (args: { store: Store; lock: Lock }): Service => {
  const { store, lock } = args;
  const box = async (payload: DetectPayload) => {
    return await store.detect.box(payload);
  };
  return {
    box,
  }
}

import { v4 as uuid } from 'uuid';
import { Lock, ErrorKind, Store } from ".";
import { uniq } from "lodash"
import { Box } from "@charpoints/core/box"

export type DetectPayload = {
  data: string; //base64
};

export type AnnotatePayload = {
  id: string; //base64
  boxes: Box[];
};

export type Service = {
  box: (payload: DetectPayload) => Promise<Box[] | Error>;
  annotate: (payload: AnnotatePayload) => Promise<void | Error>;
};

export const Service = (args: { store: Store; lock: Lock }): Service => {
  const { store, lock } = args;
  const box = async (payload: DetectPayload) => {
    return await store.detect.box(payload);
  };
  const annotate = async (payload: AnnotatePayload) => {
    return await store.detect.annotate(payload);
  };
  return {
    box,
    annotate
  }
}

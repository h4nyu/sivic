import { v4 as uuid } from 'uuid';
import { Lock, Store, ErrorKind } from "@sivic/core"
import { Workspace } from "@sivic/core/workspace"
import { Service as WorkspaceService } from "@sivic/core/workspace"

export type CropPayload = {
  imageData: string,
  box:{
    x0:number,
    y0:number,
    x1:number,
    y1:number,
  }
};

export type Service = {
  crop: (payload:CropPayload) => Promise<string | Error>;
};

export const Service = (args: { store: Store; lock: Lock }): Service => {
  const { store, lock } = args;
  const services = {
    workspace: WorkspaceService(args)
  }

  const crop = async (payload: CropPayload) => {
    return await lock.auto(async () => {
      let image = await store.transform.crop(payload);
      if (image instanceof Error) { return image; }
      return image
    });
  };

  return {
    crop,
  };
};

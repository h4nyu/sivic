import { Lock, ErrorKind, Store } from "@sivic/core";
import { Workspace } from "@sivic/core/workspace";
import { UniqueFn } from "@sivic/core/workspace/unique"

export type Payload = {
  id?: string;
  name: string;
};
export type CreateFn = (payload: Payload) => Promise<Workspace | Error>
export const CreateFn = (props: {
  store: Store;
  lock: Lock;
}) => {
  const unique = UniqueFn(props)
  return async (payload: Payload) => {
    return await props.lock.auto(async () => {
      const workspace = Workspace(payload)
      const uniqueErr = await unique(workspace)
      if(uniqueErr instanceof Error) { return uniqueErr }

    })
  }
}

export default CreateFn

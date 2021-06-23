import { v4 } from "uuid";

export type Tag = {
  id: string,
  name: string,
  workspaceId?: string,
}

export const Tag = (args?: {
  id?:string;
  name?: string;
  workspaceId?: string
}):Tag => {
  const id = args?.id || v4()
  const name = args?.name || ""
  const workspaceId = args?.workspaceId
  return {
    id,
    name,
    workspaceId
  }
}


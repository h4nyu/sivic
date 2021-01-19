import { v4 as uuid } from 'uuid';

export type Workspace = {
  id: string
  name: string
  createdAt: Date
}

export type WorkspaceImage = {
  workspaceId: string
  imageId: string
}

export const Workspace = (args?: Workspace):Workspace => {
  return args || {
    id: uuid(),
    name: "",
    createdAt: new Date(),
  }
}

export const Service = () => {
  const uploadImages = async () => { }
  return {
    uploadImages
  }
}

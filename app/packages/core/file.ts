import { v4 as uuid } from 'uuid';
import { Lock, Store, ErrorKind } from "@sivic/core"

export type File = {
  id: string,
  data: string; //base64
  createdAt: Date,
}

export const File = (args?:{
  id?: string,
  data?: string,
  createdAt?: Date,
}) => {
  const id = args?.id ?? uuid()
  const data = args?.data ?? ""
  const createdAt = args?.createdAt ?? new Date()
  return {
    id,
    data,
    createdAt,
  }
}
export type FindPayload = {
  id?: string,
  name?: string,
}

export type CreatePayload = {
  id?: string,
  data?: string,
  createdAt?: Date,
}
export type Service = {
  find: (payload: FindPayload) => Promise<File | Error>
}
export const Service = (args: { store: Store; lock: Lock }): Service => {
  const { store, lock } = args;
  const find = async (payload: FindPayload) => {
    const file = await store.file.find(payload)
    if(file instanceof Error) { return file }
    if(file === undefined) { return new Error(ErrorKind.WorkspaceNotFound) }
    return file
  }
  return {
    find
  }
}

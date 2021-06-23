import { v4 as uuid } from 'uuid';
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
  const id = args?.id || uuid()
  const data = args?.data || ""
  const createdAt = args?.createdAt || new Date()
  return {
    id,
    data,
    createdAt,
  }
}

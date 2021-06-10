import { Row, Sql } from "postgres";
import { first, keyBy } from "lodash";

import { ErrorKind } from '@sivic/core'
import { Image } from "@sivic/core/image";
import { Box as CharBox } from "@charpoints/core/box"
import { ImageStore } from "@sivic/core";
import { RootApi as ImageApi } from "@charpoints/api"

const COLUMNS = [
  "workspace_id", 
  "image_id", 
  "tag", 
  "created_at",
  "parent_id",
] as const
export const Store = (
  imageApi: ImageApi,
  sql: Sql<any>,
): ImageStore => {
  const to = (r: Row) => {
    return {
      id: r.image_id,
      workspaceId: r.workspace_id,
      tag: r.tag || undefined,
      parentId: r.parent_id || undefined,
      createdAt: r.created_at,
    };
  };

  const from = (r: Image): Row => {
    return {
      workspace_id: r.workspaceId,
      image_id: r.id,
      tag: r.tag || null,
      created_at: r.createdAt,
      parent_id: r.parentId || null,
    };
  };

  const find = async (payload: {
    id: string;
    hasData?:boolean,
  }): Promise<Image | Error> => {
    let image = await imageApi.image.find(payload)
    if(image instanceof Error) { return image }
    const rows = await sql`SELECT * FROM workspace_images WHERE image_id = ${image.id} LIMIT 1`
    const row = first(rows.map(to))
    if(row === undefined) { return new Error(ErrorKind.ImageNotFound)}
    return {
      ...image,
      ...row,
    }
  };
  const filter = async (payload: {
    workspaceId: string;
  }): Promise<Image[] | Error> => {
    try{
      const rows = await sql`SELECT * FROM workspace_images WHERE workspace_id = ${payload.workspaceId}`
      const workspaceImages = rows.map(to)
      const imageIds = workspaceImages.map(x => x.id)
      const images = await imageApi.image.filter({ids: imageIds})
      if(images instanceof Error) { return images }
      const rel:any = keyBy(workspaceImages, x => x.id)
      return images.map(x => {
        return {
          ...x,
          ...rel[x.id],
        }
      })
    }catch(err){
      return err
    }
  };

  const insert = async (payload: Image): Promise<void | Error> => {
    try {
      await sql`INSERT INTO workspace_images ${sql(from(payload), ...COLUMNS)}`
      let err = await imageApi.image.create({
        id: payload.id,
        data: payload.data || "",
        name: payload.name,
      })
      if(err instanceof Error) {return err}
    }catch(e) {
      return e
    }
  };

  const update = async (payload:Image): Promise<void | Error> => {
    try {
      await sql`UPDATE workspace_images SET ${sql(from(payload), ...COLUMNS)} WHERE image_id = ${payload.id}`
      const err = await imageApi.image.update(payload)
      if(err instanceof Error) {return err}
    }catch(e) {
      return e
    }
  };

  const delete_ = async (payload:{id:string}): Promise<void | Error> => {
    let err = await imageApi.image.delete(payload)
    if(err instanceof Error) { return err }
  };
  return {
    find,
    insert,
    filter,
    update,
    delete: delete_,
  };
};

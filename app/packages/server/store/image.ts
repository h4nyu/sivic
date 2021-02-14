import { Row, Sql } from "postgres";
import { first } from "lodash";

import { ErrorKind } from '@sivic/core'
import { Image } from "@sivic/core/image";
import { ImageStore } from "@sivic/core";
import { RootApi as ImageApi } from "@charpoints/api"

export const Store = (
  imageApi: ImageApi,
  sql: Sql<any>,
): ImageStore => {
  // const to = (r: Row): Image => {
  //   return {
  //   };
  // };

  // const from = (r: Image): Row => {
  //   return {
  //     id: r.id,
  //     name: r.name,
  //     created_at: r.createdAt,
  //   };
  // };

  const find = async (payload: {
    id: string;
  }): Promise<Image | Error> => {
    let image = await imageApi.image.find(payload)
    if(image instanceof Error) { return image }
    const rows = await sql`SELECT tag, workspace_id FROM workspace_images WHERE image_id = ${image.id} LIMIT 1`
    const row = first(rows)
    if(row === undefined) { return new Error(ErrorKind.ImageNotFound)}
    return {
      ...image,
      tag: row.tag || undefined,
      workspaceId: row.workspace_id,
    }
  };

  const insert = async (payload: Image): Promise<void | Error> => {
    let err = await imageApi.image.create({
      id: payload.id,
      data: payload.data || "",
      name: payload.name,
    })
    if(err instanceof Error) {return err}
    const row =  {
      workspace_id: payload.workspaceId,
      image_id: payload.id,
      tag: payload.tag || null,
    }
    try {
      await sql`INSERT INTO workspace_images ${sql(row, "workspace_id", "image_id", "tag")}`
    }catch(e) {
      return e
    }

  };

  const update = async (payload:Image): Promise<void | Error> => {
    let err = await imageApi.image.update(payload)
    if(err instanceof Error) {return err}
    try {
      await sql`UPDATE workspace_images SET tag = ${payload.tag || null} WHERE image_id = ${payload.id}`
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
    update,
    delete: delete_,
  };
};

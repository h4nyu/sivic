import { Row, Sql } from "postgres";
import { first, keyBy } from "lodash";

import { ErrorKind } from '@sivic/core'
import { Image } from "@sivic/core/image";
import { Box as CharBox } from "@charpoints/core/box"
import { ImageStore } from "@sivic/core";
import { RootApi as ImageApi } from "@charpoints/api"

const TABLE = "images"

const COLUMNS = [
  "id", 
  "name",
  "workspace_id", 
  "parent_id",
  "tag_id", 
  "created_at",
] as const
export const Store = (
  sql: Sql<any>,
): ImageStore => {
  const to = (r: Row) => {
    return Image({
      id: r.id,
      name: r.name,
      workspaceId: r.workspace_id || undefined,
      tagId: r.tag_id || undefined,
      parentId: r.parent_id || undefined,
      fileId: r.file_id || undefined,
      createdAt: r.created_at,
    });
  };

  const from = (r: Image): Row => {
    return {
      id: r.id,
      name: r.name,
      workspace_id: r.workspaceId,
      parent_id: r.parentId || null,
      tag_id: r.tagId || null,
      file_id: r.fileId || null,
      created_at: r.createdAt,
    };
  };

  const find = async (payload: {
    id: string;
  }): Promise<Image | Error> => {
    const { id } = payload
    const rows = await sql`SELECT * FROM ${sql(TABLE)} WHERE id = ${id} LIMIT 1`
    const row = first(rows.map(to))
    if(row === undefined) { return new Error(ErrorKind.ImageNotFound)}
    return row
  };
  const filter = async (payload: {
    ids?: string[],
    workspaceId?: string,
    parentId?: string,
  }): Promise<Image[] | Error> => {
    try{
      const rows =  await (async () =>{
        if(payload.ids !== undefined && payload.ids.length > 0) {
          return await sql`SELECT * FROM ${sql(TABLE)} WHERE id IN (${payload.ids})`
        } else if(payload.workspaceId !== undefined && payload.parentId !== undefined) {
          return await sql`SELECT * FROM ${sql(TABLE)} WHERE workspace_id = ${payload.workspaceId} AND parent_id = ${payload.parentId}`
        } else if(payload.workspaceId !== undefined) {
          return await sql`SELECT * FROM ${sql(TABLE)} WHERE workspace_id = ${payload.workspaceId}`
        }else if(payload.parentId !== undefined) {
          return await sql`SELECT * FROM ${sql(TABLE)} WHERE parent_id = ${payload.parentId}`
        }
        return []
      })()
     return rows.map(to)
    }catch(err){
      return err
    }
  };

  const insert = async (payload: Image): Promise<void | Error> => {
    try {
      await sql`INSERT INTO ${sql(TABLE)} ${sql(from(payload), ...COLUMNS)}`
    }catch(e) {
      return e
    }
  };

  const update = async (payload:Image): Promise<void | Error> => {
    try {
      await sql`UPDATE ${sql(TABLE)} SET ${sql(from(payload), ...COLUMNS)} WHERE id = ${payload.id}`
    }catch(e) {
      return e
    }
  };

  const delete_ = async (payload:{id:string}): Promise<void | Error> => {
    const { id } = payload
    try {
      await sql`DELETE FROM ${sql(TABLE)} WHERE id = ${id} OR parent_id = ${id}`
    }catch(e) {
      return e
    }
  };
  return {
    find,
    insert,
    filter,
    update,
    delete: delete_,
  };
};

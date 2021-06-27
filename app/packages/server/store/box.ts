import { Row, Sql } from "postgres";
import { Box } from "@sivic/core/box";
import { BoxStore } from "@sivic/core";


const TABLE = "boxes"
const COLUMNS = [
  "id", 
  "x0",
  "y0",
  "x1",
  "y1",
  "image_id", 
  "tag_id", 
] as const

export const Store = (
  sql: Sql<any>
): BoxStore => {
  const to = (r: Row) => {
    return Box({
      id: r.id,
      x0: r.x0,
      y0: r.y0,
      x1: r.x1,
      y1: r.y1,
      imageId: r.image_id || undefined,
      tagId: r.tag_id || undefined,
    });
  };

  const from = (r: Box): Row => {
    return {
      id: r.id,
      x0: r.x0,
      y0: r.y0,
      x1: r.x1,
      y1: r.y1,
      tag_id: r.tagId || null,
      image_id: r.imageId || null,
    };
  };

  const filter = async (payload: {
    imageId?: string;
  }) => {
    try{
      const { imageId } = payload
      const rows = await(async () => {
        if(imageId !== undefined){
          return await sql`SELECT * FROM ${sql(TABLE)} WHERE image_id = ${imageId}`
        }
        return []
      })()
      return rows.map(to)
    }catch(e){
      return e
    }
  };

  const load = async (payload:  Box[]) => {
    try {
      await sql`INSERT INTO ${sql(TABLE)} ${sql(payload.map(from), ...COLUMNS)}`
    }catch(e){
      return e
    }
  };

  const delete_ = async (payload: {imageId?: string}) => {
    const { imageId } = payload
    try {
      if(imageId !== undefined) { 
        await sql`DELETE FROM ${sql(TABLE)} WHERE image_id = ${imageId}`
      }
    }catch(e) {
      return e
    }
  };

  return {
    filter,
    load,
    delete: delete_,
  };
};

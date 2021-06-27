import { Row, Sql } from "postgres";
import { Point } from "@sivic/core/point";
import { PointStore } from "@sivic/core";
import { RootApi as ImageApi } from "@charpoints/api"

const TABLE = "points"
const COLUMNS = [
  "id", 
  "x",
  "y",
  "image_id", 
] as const


export const Store = (
  sql: Sql<any>
): PointStore => {
  const to = (r: Row) => {
    return Point({
      id: r.id,
      x: r.x,
      y: r.y,
      imageId: r.image_id || undefined,
    });
  };

  const from = (r: Point): Row => {
    return {
      id: r.id,
      x: r.x,
      y: r.y,
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

  const load = async (payload: Point[]) => {
    try {
      await sql`INSERT INTO ${sql(TABLE)} ${sql(payload.map(from), ...COLUMNS)}`
    }catch(e){
      return e
    }
  };
  const delete_ = async (payload: {imageId?:string}) => {
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

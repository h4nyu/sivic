import { Row, Sql } from "postgres";
import { Line } from "@sivic/core/line";
import { RootApi as ImageApi } from "@charpoints/api"

const COLUMNS = [
  "id", 
  "image_id", 
  "x0", 
  "y0",
  "x1",
  "y1",
] as const

export const Store = (
  sql: Sql<any>
) => {
  const to = (r: Row) => {
    return Line({
      id: r.id,
      imageId: r.image_id,
      x0: r.x0,
      y0: r.y0,
      x1: r.x1,
      y1: r.y1,
    });
  };

  const from = (r: Line): Row => {
    return {
      id: r.id,
      image_id: r.imageId,
      x0: r.x0,
      y0: r.y0,
      x1: r.x1,
      y1: r.y1,
    };
  };

  const filter = async (payload: {
    imageId?: string;
  }) => {
    try{
      const { imageId } = payload
      const rows =  await (async () =>{
        if(imageId) {
          return await sql`SELECT * FROM lines WHERE image_id = ${imageId}`
        }
        return []
      })()
      return rows.map(to)
    }catch(err){
      return err
    }
  };

  const load = async (payload: Line[]) => {
    try{
      await sql` INSERT INTO lines ${sql(
        payload.map(from),
        ...COLUMNS,
      )}`;
    }catch(err){
      return err
    }
  };
  const delete_ = async (payload: {
    imageId: string;
  }) => {
    try {
      const { imageId } = payload;
      await sql`DELETE FROM lines WHERE image_id=${imageId}`;
    } catch (err) {
      return err;
    }
  };

  return {
    filter,
    load,
    delete: delete_
  };
};

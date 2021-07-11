import { Row, Sql } from "postgres";
import { File } from "@sivic/core/file";
import { first } from "lodash";

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
    return File({
      id: r.id,
      data: r.data ?? undefined,
      createdAt: r.created_at,
    });
  };

  const from = (r: File): Row => {
    return {
      id: r.id,
      data: r.data ?? null,
      created_at: r.createdAt,
    };
  };

  const find = async (payload: {
    id?: string;
  }) => {
    try{
      const { id } = payload
      const rows =  await (async () =>{
        if(id) {
          return await sql`SELECT * FROM files WHERE id = ${id}`
        }
        return []
      })()
      return first(rows.map(to))
    }catch(err){
      return err
    }
  };

  const insert = async (payload: File) => {
    try{
      await sql` INSERT INTO files ${sql(
        from(payload),
        ...COLUMNS,
      )}`;
    }catch(err){
      return err
    }
  };

  const delete_ = async (payload: {
    id?: string;
  }) => {
    try {
      const { id } = payload
      if(id !== undefined){
        await sql`DELETE FROM files WHERE id=${id}`;
      }
    } catch (err) {
      return err;
    }
  };

  return {
    find,
    insert,
    delete: delete_
  };
};
export default Store

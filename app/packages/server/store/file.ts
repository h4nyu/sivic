import { Row, Sql } from "postgres";
import { File } from "@sivic/core/file";
import { first } from "lodash";

const COLUMNS = [
  "id", 
  "data", 
  "created_at", 
] as const

export const Store = (
  sql: Sql<any>
) => {
  const to = (r: Row) => {
    return File({
      id: r.id,
      data: (r.data && r.data.toString("base64")) ?? undefined,
      createdAt: r.created_at,
    });
  };

  const from = (r: File): Row => {
    return {
      id: r.id,
      data: (r.data && Buffer.from(r.data, "base64")) ?? null,
      created_at: r.createdAt,
    };
  };

  const find = async (payload: {
    id?: string;
  }) => {
    try{
      const { id } = payload
      const rows =  await (async () =>{
        if(id !== undefined) {
          return await sql`SELECT * FROM files WHERE id = ${id} LIMIT 1`
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

import { Row, Sql } from "postgres";
import { Workspace } from "@sivic/core/workspace";
import { WorkspaceStore } from "@sivic/core";

export const Store = (sql: Sql<any>): WorkspaceStore => {
  const to = (r: Row): Workspace => {
    return {
      id: r.id,
      name: r.name,
      createdAt: r.created_at,
    };
  };

  const from = (r: Workspace): Row => {
    return {
      id: r.id,
      name: r.name,
      created_at: r.createdAt,
    };
  };

  const filter = async (payload: {
    workspaceId?: string;
  }) => {
    try {
      const { workspaceId } = payload;
      let rows: Row[] = [];
      if (workspaceId !== undefined) {
        rows = await sql`SELECT * FROM workspaces WHERE id =${workspaceId}`;
      } else {
        rows = await sql`SELECT * FROM workspaces`;
      }
      return rows.map(to);
    } catch (err) {
      return err;
    }
  };

  const insert = async (payload: Workspace): Promise<void | Error> => {
    try {
      await sql`
      INSERT INTO workspaces ${sql(
        from(payload),
        "id",
        "name",
        "created_at",
      )}`;
    } catch (err) {
      return err;
    }
  };

  const delete_ = async (payload: {
    workspaceId?: string;
  }) => {
    try {
      const { workspaceId } = payload;
      if (workspaceId !== undefined) {
        await sql`DELETE FROM workspaces WHERE id=${workspaceId}`;
      }
    } catch (err) {
      return err;
    }
  };

  const clear = async (): Promise<void> => {
    try {
      await sql`TRUNCATE TABLE workspaces`;
    } catch (err) {
      return err;
    }
  };

  return {
    filter,
    insert,
    clear,
    delete: delete_,
  };
};

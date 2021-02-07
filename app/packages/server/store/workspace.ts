import { Row, Sql } from "postgres";
import { first } from "lodash";

import { Workspace } from "@sivic/core/workspace";
import { WorkspaceStore } from "@sivic/core";

export const Store = (sql: Sql<any>): WorkspaceStore => {
  const to = (r: Row): Workspace => {
    return {
      id: r.id,
      name: r.name,
      imageIds: [],
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

  const find = async (payload: {
    id?: string;
  }): Promise<Workspace | undefined | Error> => {
    try {
      const { id } = payload;
      let rows = [];
      if (id !== undefined) {
        rows = await sql`SELECT * FROM workspaces WHERE id=${id}`;
      }
      const row = first(rows.map(to));
      if (row === undefined) {
        return;
      }
      const workspaceImages = await sql`SELECT * FROM workspace_images WHERE workspace_id = ${row.id}`
      row.imageIds = workspaceImages.map(x => x.image_id)
      return row;
    } catch (err) {
      return err;
    }
  };

  const filter = async (payload: {
    ids?: string[];
  }): Promise<Workspace[] | Error> => {
    try {
      const { ids } = payload;
      let rows = [];
      const columns = [
        "id",
        "name",
        "created_at",
      ];
      if (ids !== undefined && ids.length > 0) {
        rows = await sql`SELECT ${sql(
          columns
        )} FROM workspaces WHERE id IN (${ids})`;
      } else {
        rows = await sql`SELECT ${sql(columns)} FROM workspaces`;
      }
      if(rows.length === 0){
        return []
      }
      const workspaces = rows.map(to)
      const workspaceIds = workspaces.map(x => x.id)
      const workspaceImages = await sql`SELECT * FROM workspace_images WHERE workspace_id IN (${workspaceIds})`
      for(const workspace of workspaces){
        workspace.imageIds = workspaceImages.filter(x => x.workspace_id === workspace.id).map(x => x.image_id)
      }
      return workspaces;
    } catch (err) {
      return err;
    }
  };
  const replaceImageIds = async (workspaceId:string, imageIds:string[]) => {
    if(imageIds.length === 0){
      return
    }
    const rows = imageIds.map(x => ({workspace_id:workspaceId, image_id:x}))
    await sql`DELETE FROM workspace_images WHERE workspace_id = ${workspaceId}` 
    await sql`INSERT INTO workspace_images ${sql(rows, "workspace_id", "image_id")}` 
  }
  const insert = async (payload: Workspace): Promise<void | Error> => {
    try {
      await sql`
      INSERT INTO workspaces ${sql(
        from(payload),
        "id",
        "name",
        "created_at",
      )}`;
      await replaceImageIds(payload.id, payload.imageIds)
    } catch (err) {
      return err;
    }
  };
  const update = async (payload: Workspace): Promise<void | Error> => {
    try {
      await sql`
      INSERT INTO workspaces ${sql(
        from(payload),
        "id",
        "name",
        "created_at",
      )}`;
      await replaceImageIds(payload.id, payload.imageIds)
    }catch (err) {
      return err;
    }
  };

  const delete_ = async (payload: {
    id?: string;
  }) => {
    try {
      const { id } = payload;
      if (id !== undefined) {
        await sql`DELETE FROM workspaces WHERE id=${id}`;
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
    find,
    insert,
    update,
    clear,
    delete: delete_,
  };
};

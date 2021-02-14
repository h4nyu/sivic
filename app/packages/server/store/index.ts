import postgres from "postgres";
import { Store as WorkspaceStore } from "./workspace";
import { Store as ImageStore } from "./image"

export const Store = (args: { url: string; max?: number }) => {
  const sql = postgres(args.url, {
    max: args.max || 5,
  });
  const close = async () => {
    await sql.end({ timeout: 5 });
  };
  const workspace = WorkspaceStore(sql);
  const image = ImageStore()
  return {
    workspace,
    image,
    close,
  };
};
export default Store;

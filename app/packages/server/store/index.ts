import postgres from "postgres";
import { Store as WorkspaceStore } from "./workspace";
import { Store as ImageStore } from "./image"
import { Store as DetectStore } from "./detect"
import { RootApi as ImageApi } from "@charpoints/api"

export const Store = (args: { 
  url: string; 
  max?: number,
  imageUrl: string,
  detectUrl: string,
}) => {
  const sql = postgres(args.url, {
    max: args.max || 5,
  });
  const imageApi = ImageApi()
  imageApi.setUrl(args.imageUrl)
  const close = async () => {
    await sql.end({ timeout: 5 });
  };
  const workspace = WorkspaceStore(sql);
  const image = ImageStore(imageApi, sql)
  const detect = DetectStore(args.detectUrl)
  return {
    workspace,
    image,
    detect,
    close,
  };
};
export default Store;

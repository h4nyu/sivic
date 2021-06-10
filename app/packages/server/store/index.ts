import postgres from "postgres";
import { Store as WorkspaceStore } from "./workspace";
import { Store as ImageStore } from "./image"
import { Store as DetectStore } from "./detect"
import { Store as BoxStore } from "./box"
import { Store as PointStore } from "./point"
import { Store as TransformStore } from "./transform"
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
  const box = BoxStore(imageApi,sql)
  const point = PointStore(imageApi,sql)
  const transform = TransformStore(imageApi,sql)
  const detect = DetectStore(args.detectUrl)
  return {
    workspace,
    image,
    transform,
    detect,
    box,
    point,
    close,
  };
};
export default Store;

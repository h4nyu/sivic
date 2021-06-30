import postgres from "postgres";
import { Store as WorkspaceStore } from "./workspace";
import { Store as ImageStore } from "./image"
import { Store as DetectStore } from "./detect"
import { Store as BoxStore } from "./box"
import { Store as PointStore } from "./point"
import { Store as TransformStore } from "./transform"
import { Store as LineStore } from "./line"

export const Store = (args: { 
  url: string; 
  max?: number,
  imageUrl: string,
  detectUrl: string,
}) => {
  const sql = postgres(args.url, {
    max: args.max || 5,
  });
  const close = async () => {
    await sql.end({ timeout: 5 });
  };
  const workspace = WorkspaceStore(sql);
  const image = ImageStore(sql)
  const box = BoxStore(sql)
  const point = PointStore(sql)
  const transform = TransformStore()
  const detect = DetectStore(args.detectUrl)
  const line = LineStore(sql)
  return {
    workspace,
    image,
    transform,
    detect,
    box,
    point,
    line,
    close,
  };
};
export default Store;

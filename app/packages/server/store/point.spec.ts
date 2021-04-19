import { Store } from "@sivic/server"; 
import fs from "fs"; 
import { v4 as uuid } from "uuid";
import { Point } from "@charpoints/core/point";
import { Image, ImageTag } from "@sivic/core/image";

const rootStore = Store();

afterAll(async () => {
  await rootStore.close();
});

describe("point", () => {
  const imageStore = rootStore.image;
  const pointStore = rootStore.point;
  let row = Image({
    id: uuid(),
    workspaceId: uuid(),
  })
  const point = Point({x: 30,  y: 80})
  const valErr = point.validate() 
  beforeAll(async () => {
    const buf = await fs.promises.readFile("/srv/package.json");
    row.data = buf.toString("base64");
  });
  afterAll(async () => {
    await imageStore.delete({id: row.id});
  });
  test("replace and filter", async () => {
    let img = await imageStore.insert(row)
    if(img instanceof Error) { throw img }
    let b = await pointStore.replace({points:[point], imageId: row.id})
    if(b instanceof Error) { throw b }
    const err = await pointStore.filter({imageId: row.id})
  });
});

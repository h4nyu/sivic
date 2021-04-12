import { Store } from "@sivic/server"; 
import fs from "fs"; 
import { v4 as uuid } from "uuid";
import { Box } from "@charpoints/core/box";
import { Image, ImageTag } from "@sivic/core/image";

const rootStore = Store();

afterAll(async () => {
  await rootStore.close();
});

describe("box", () => {
  const imageStore = rootStore.image;
  const boxStore = rootStore.box;
  let row = Image({
    id: uuid(),
    workspaceId: uuid(),
  })
  const box = Box({x0: 30, y0: 30, x1: 80, y1: 80, confidence: 0.9})
  const valErr = box.validate() 
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
    let b = await boxStore.replace({boxes:[box], imageId: row.id})
    if(b instanceof Error) { throw b }
    const err = await boxStore.filter({imageId: row.id})
  });
});

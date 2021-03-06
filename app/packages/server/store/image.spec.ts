import { Store } from "@sivic/server"; 
import fs from "fs"; 
import { v4 as uuid } from "uuid";
import { Image, ImageTag } from "@sivic/core/image";

const rootStore = Store();

afterAll(async () => {
  await rootStore.close();
});

describe("image", () => {
  const store = rootStore.image;
  let row = Image({
    id: uuid(),
    workspaceId: uuid(),
    parentId: uuid(),
  })
  beforeAll(async () => {
    const buf = await fs.promises.readFile("/srv/package.json");
    row.data = buf.toString("base64");
    row.id = uuid();
  });
  afterAll(async () => {
    await store.delete({id: row.id});
  });
  test("insert, find and update", async () => {
    let err = await store.insert(row)
    if(err instanceof Error) { throw err }
  });
  test("update", async () => {
    let err = await store.update({
      ...row,
      tag: ImageTag.Target
    })
    if(err instanceof Error) { throw err }
  });
});

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
  const rows = [0, 1, 2, 3].map(i => {
    return Image({
      id: uuid(),
      workspaceId: uuid(),
      parentId: uuid(),
    })
  })
  beforeAll(async () => {
    for(const row of rows){
      let err = await store.insert(row)
      if(err instanceof Error) { throw err }
    }
  });
  afterAll(async () => {
    for(const row of rows){
      await store.delete({id: row.id});
    }
  });
  test("update", async () => {
    let err = await store.update({
      ...rows[0],
    })
    if(err instanceof Error) { throw err }
  });
  test("filter.parentId", async () => {
    let res = await store.filter({ parentId: rows[0].parentId })
    if(res instanceof Error) { throw res }
    expect(res[0].id).toBe(rows[0].id)
  });
});

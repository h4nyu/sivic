import { Store } from "@sivic/server"; 
import fs from "fs"; 
import { v4 as uuid } from "uuid";
import { Tag } from "@sivic/core/tag";

const rootStore = Store();

afterAll(async () => {
  await rootStore.close();
});

describe("tag", () => {
  const store = rootStore.tag;
  const workspaceId = uuid()
  const rows = [0, 1, 2, 3].map(i => {
    return Tag({
      name: `name-${i}`,
      workspaceId,
    })
  })
  beforeAll(async () => {
    for(const row of rows){
      let err = await store.insert(row);
      if(err instanceof Error) { throw err}
    }
  });

  afterAll(async () => {
    await store.delete({ workspaceId });
  });
  test("filter", async () => {
    let res = await store.filter({ workspaceId })
    if(res instanceof Error) { throw res }
    expect(res.length).toBe(rows.length)
  });

  test("find workspaceId name", async () => {
    const name = "name-1"
    let res = await store.find({ workspaceId, name })
    if(res instanceof Error) { throw res }
    expect(JSON.stringify(res)).toBe(JSON.stringify(rows[1]))
  });

  test("insert and update", async () => {
    const tag = Tag({
      name: uuid(),
      workspaceId:uuid(),
    })
    let err = await store.insert(tag);
    if(err instanceof Error) { throw err }
    let res = await store.find({ id: tag.id })
    if(res instanceof Error) { throw res }
    expect(JSON.stringify(res)).toBe(JSON.stringify(tag))
    tag.name = uuid()
    tag.workspaceId = uuid()
    err = await store.update(tag)
    res = await store.find({ id: tag.id })
    if(res instanceof Error) { throw res }
    expect(JSON.stringify(res)).toBe(JSON.stringify(tag))
  });
});

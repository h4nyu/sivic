import { Store } from "."; import fs from "fs"; import { Workspace } from "@sivic/core/workspace";

const rootStore = Store({ url: process.env.DATABASE_URL || "" });

afterAll(async () => {
  await rootStore.close();
});

describe("workspace", () => {
  const store = rootStore.workspace;
  const row = {
    ...Workspace(),
  };

  beforeAll(async () => {
    await store.clear();
  });

  test("insert", async () => {
    const err = await store.insert(row);
    if (err instanceof Error) {
      throw err;
    }
    const res = await store.find({ id: row.id });
    if (res instanceof Error) {
      throw res;
    }
    expect(res).toEqual(row);
  });
  test("filter", async () => {
    const rows = await store.filter({});
    if (rows instanceof Error) {
      throw rows;
    }
    expect(rows).toMatchObject([row]);
  });
  test("delete", async () => {
    const err = await store.delete({ id: row.id });
    if (err instanceof Error) {
      throw err;
    }
    const rows = await store.filter({});
    if (rows instanceof Error) {
      throw rows;
    }
    expect(rows).toEqual([]);
  });
});

import { Store } from "@sivic/server"; 
import fs from "fs"; 
import { v4 as uuid } from "uuid";
import { Line } from "@sivic/core/line";

const rootStore = Store();

afterAll(async () => {
  await rootStore.close();
});

describe("line", () => {
  const store = rootStore.line;
  const imageId = uuid()
  const rows = [0, 1, 2, 3].map(i => {
    return Line({
      imageId,
      x0: i,
      y0: i + 1,
      x1: i + 2,
      y1: i + 3,
    })
  })
  beforeAll(async () => {
    let err = await store.load(rows);
    if(err instanceof Error) { throw err}
  });

  afterAll(async () => {
    await store.delete({imageId});
  });
  test("filter", async () => {
    let res = await store.filter({ imageId })
    if(res instanceof Error) { throw res }
    expect(res.length).toBe(rows.length)
  });
});

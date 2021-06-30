import { Store } from "@sivic/server"; 
import fs from "fs"; 
import { v4 as uuid } from "uuid";
import { Box } from "@sivic/core/box";
import { Image, ImageTag } from "@sivic/core/image";

const rootStore = Store();

afterAll(async () => {
  await rootStore.close();
});

describe("box", () => {
  const boxStore = rootStore.box;
  const imageId = uuid()
  const box = Box({x0: 30, y0: 30, x1: 80, y1: 80, imageId})
  const valErr = box.validate() 
  test("load and delete", async () => {
    let err = await boxStore.load([box])
    if(err instanceof Error) { throw err }
    let savedRows = await boxStore.filter({imageId})
    if(savedRows instanceof Error) { throw savedRows }
    expect(JSON.stringify([box])).toBe(JSON.stringify(savedRows))
    err = await boxStore.delete({imageId})
    if(err instanceof Error) { throw err }
    savedRows = await boxStore.filter({imageId})
    if(savedRows instanceof Error) { throw savedRows }
    expect(savedRows.length).toBe(0)
  });
});

import { Store } from "@sivic/server"; 
import fs from "fs"; 
import { v4 as uuid } from "uuid";
import { Point } from "@sivic/core/point";
import { Image, ImageTag } from "@sivic/core/image";

const rootStore = Store();

afterAll(async () => {
  await rootStore.close();
});

describe("point", () => {
  const pointStore = rootStore.point;
  const imageId = uuid()
  const point = Point({x: 30,  y: 80, imageId})
  test("load and delete", async () => {
    let loadErr = await pointStore.load([point])
    if(loadErr instanceof Error) { throw loadErr }
    let savedRows = await pointStore.filter({imageId})
    if(savedRows instanceof Error) { throw savedRows }
    expect(JSON.stringify(savedRows)).toEqual(JSON.stringify([point]))
    let delErr = await pointStore.delete({imageId})
    if(delErr instanceof Error) { throw delErr }
    savedRows = await pointStore.filter({imageId})
    if(savedRows instanceof Error) { throw savedRows }
    expect(savedRows).toEqual([])
  });
});

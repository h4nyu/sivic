import { Store } from "@sivic/server"; 
import { v4 as uuid } from "uuid";
import { File } from "@sivic/core/file";
import fs from "fs"

const rootStore = Store();

afterAll(async () => {
  await rootStore.close();
});

describe("file", () => {
  const file = File()
  const store = rootStore.file

  beforeAll(async () => {
    const buffer = await fs.promises.readFile("/srv/package.json");
    file.data = buffer.toString("base64");
    const insertErr = await store.insert(file)
    if(insertErr instanceof Error) {
      throw insertErr
    }
  });

  afterAll(async () => {
    await store.delete({ id: file.id });
  });

  test("find ", async () => {
    let res = await store.find({ id: file.id })
    if(res instanceof Error) { throw res }
    expect(JSON.stringify(res)).toBe(JSON.stringify(file))
  });
});

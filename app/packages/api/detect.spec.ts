import { RootApi } from ".";

const rootApi = RootApi();
rootApi.setUrl("http://srv");

describe("spec", () => {
  const api = rootApi.detect;
  test("detect", async () => {
    const savedRow = await api.box({ data: '' });
    if (savedRow instanceof Error) {
      throw savedRow;
    }
    console.log(savedRow)
  });
});

import { RootApi } from ".";
import {
  Workspace,
} from "@sivic/core/workspace";

const rootApi = RootApi();
rootApi.setUrl("http://srv");
describe("spec", () => {
  const api = rootApi.workspace;
  test("create and filter", async () => {
    const id = await api.create({ name: '' });
    if (id instanceof Error) {
      throw id;
    }
    const saved = await api.find({ id });
    if (saved instanceof Error) {
      throw saved;
    }
    console.log(saved);
  });
});

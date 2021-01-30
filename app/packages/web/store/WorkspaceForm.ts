import { observable, computed } from "mobx";
import { Map, List } from "immutable";
import { Workspaces } from ".";
import { ToastStore } from "./toast";
import { LoadingStore } from "./loading";
import { RootApi } from "@sivic/api";
import {
  Workspace,
} from "@sivic/core/workspace";
import { saveAs } from 'file-saver';
import { MemoryRouter } from "react-router";
import { take, flow, sortBy, map } from "lodash/fp";
import { parseISO } from "date-fns";

export type State = {
  id: string
  name: string;
};

export type WorkspaceFrom = {
  state: State;
  init: (id:string) => Promise<void>;
  setName: (value:string) => void;
};

const State = ():State => {
  return {
    id: "",
    name: "",
  };
};

export const WorkspaceFrom = (args: {
  api: RootApi;
  loading: <T>(fn: () => Promise<T>) => Promise<T>;
  toast: ToastStore;
  onInit?: (workspace:Workspace) => void;
}): WorkspaceFrom => {
  const { api, loading, toast, onInit } = args;
  const state = observable(State());

  const init = async (id:string) => {
    await loading(async () => {
      const row = await api.workspace.find({id})
      if(row instanceof Error) {
        return row
      }
      state.id = row.id
      state.name = row.name
      onInit && onInit(row)
    })
  }
  const setName = (value:string) => {
    state.name = value
  }
  return {
    state,
    init,
    setName,
  }
};
export default WorkspaceFrom

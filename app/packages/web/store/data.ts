import { observable, computed } from "mobx";
import { Map, List } from "immutable";
import { Workspaces } from ".";
import { ToastStore } from "./toast";
import { LoadingStore } from "./loading";
import {
  Workspace,
} from "@sivic/core/workspace";
import { saveAs } from 'file-saver';
import { MemoryRouter } from "react-router";
import { take, flow, sortBy, map } from "lodash/fp";
import { parseISO } from "date-fns";

export type State = {
  workspaces: Workspaces;
};

export type DataStore = {
  state: State;
  init: () => Promise<void>;
};

const State = ():State => {
  return {
    workspaces: Map(),
  };
};

export const DataStore = (args: {
  loading: LoadingStore;
  toast: ToastStore;
}): DataStore => {
  const { loading, toast } = args;
  const state = observable(State());

  const init = async () => {
    await loading.auto(async () => {

    });
  };
  return {
    state,
    init,
  };
};

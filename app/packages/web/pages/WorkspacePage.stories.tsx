import React from "react";
import WorkspacePage from "./WorkspacePage";
import Mock from "@sivic/web/components/Mock";
import { Workspace } from "@sivic/core/workspace";
import store from "@sivic/web/store"

export default {
  title: "WorkspacePage",
  component: WorkspacePage,
  decorators: [(Story) => <div style={{height: 500}}><Story/></div>]
};

const form = store.workspaceForm
form.setName("testname")

export const Primary = (args) => <WorkspacePage /> 

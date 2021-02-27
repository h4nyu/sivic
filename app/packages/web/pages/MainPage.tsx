import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { Map } from "immutable";
import WorkspaceTable from "@sivic/web/components/WorkspaceTable";
import store from "@sivic/web/store";

const Content = observer(() => {
  const { workspaceStore } = store;
  return (
    <div
      className="box"
      style={{
        height:"100%",
        overflow: "scroll",
      }}
    >
      <WorkspaceTable
        workspaces={workspaceStore.workspaces.toList().toJS()} 
        onClick={store.workspaceForm.update} 
        onDelete={store.workspaceForm.delete} 
        onCreate={store.workspaceForm.create}
      />
    </div>
  );
});

export default Content;

import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { Map } from "immutable";
import WorkspaceTable from "@sivic/web/components/WorkspaceTable";
import store from "@sivic/web/store";

const Content = observer(() => {
  const { addWorkspace } = store.data;
  const { workspaces } = store.data.state;
  const { init } = store.data;
  return (
    <div
      style={{
        display: "grid",
        gridTemplateRows: "50px 1fr 110px",
        gridTemplateColumns: "1fr auto",
        width: "100%",
        height: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          flexFlow: "row wrap",
          alignContent: "flex-start",
          gridRow: "2",
          gridColumn: "1 / span 2",
          overflow: "scroll",
        }}
      >
        <WorkspaceTable
          workspaces={workspaces.toList().toJS()} 
          onClick={store.workspaceForm.init} 
          onAdd={addWorkspace} 
        />
      </div>
    </div>
  );
});

export default Content;

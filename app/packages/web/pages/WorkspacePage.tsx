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
      <div className="field">
        <label className="label">Name</label>
        <div className="control">
          <input 
            className="input" 
            type="text" 
            value={store.workspaceForm.state.name} 
            onChange={e => store.workspaceForm.setName(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
});

export default Content;


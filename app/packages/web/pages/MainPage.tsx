import React, { useState } from "react";
import { List } from "immutable";
import { keyBy } from "lodash";
import { v4 as uuid } from "uuid";
import { parseISO } from "date-fns";
import { observer } from "mobx-react-lite";
import { Map } from "immutable";

import WorkspaceTable from "@sivic/web/components/WorkspaceTable";

import Header from "../components/Header";
import PageLayout from "../components/PageLayout";
import store from "../store";

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
          onClick={init} 
          onAdd={addWorkspace} 
        />
      </div>
    </div>
  );
});

export default function MainPage() {
  return <PageLayout header={<Header />} content={<Content />} />;
}

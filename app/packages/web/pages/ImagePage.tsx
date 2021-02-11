import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Map } from "immutable";
import FileUpload from "@charpoints/web/components/FileUpload";
import store from "@sivic/web/store";

const Content = observer(() => {
  const { imageProcess } = store;
  const { init } = store.data;
  return (
    <div
      className="box"
      style={{
        display: "grid",
        gridTemplateRows: "1fr 110px",
        width: "100%",
        height: "100%",
      }}
    >
      Image Process Page!
    </div>
  );
});

export default Content;

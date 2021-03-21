import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Map } from "immutable";
import ImageView from "@sivic/web/components/ImageView";
import SvgCharPlot from "@sivic/web/components/SvgCharPlot";
import store from "@sivic/web/store";

const Content = observer(() => {
  const { imageProcess } = store;
  const { image, boxes } = imageProcess
  return (
    <div
      className="box"
      style={{
        display: "grid",
        gridTemplateRows: "auto auto",
        width: "100%",
        height: "100%",
      }}
    >
      <div>
        <a className="button is-info is-light" onClick={imageProcess.fetchBox}>
          Box 
        </a>
      </div>
      <div
        tabIndex={0}
        onKeyDown={e => {
          if (e.keyCode === 8) {
            console.log('delete');
          }
        }}
      >
        {
          image && image.data && 
            <SvgCharPlot 
              data={image.data} boxes={imageProcess.boxes}
              style={{
                width: "100%",
                height: "100%",
              }}
            />
        }
      </div>
    </div>
  );
});

export default Content;

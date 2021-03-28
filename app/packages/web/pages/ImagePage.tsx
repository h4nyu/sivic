import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Map } from "immutable";
import ImageView from "@sivic/web/components/ImageView";
import store from "@sivic/web/store";
import CharPlot from "@sivic/web/components/CharPlot";
import CropedBox from "@sivic/web/components/CropedBox"

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
            imageProcess.deleteBox()
          }
        }}
      >
        {
          image &&  <>
            <CharPlot 
              data={image.data} 
              boxes={imageProcess.boxes}
              selectedId={imageProcess.selectedId}
              onBoxClick={imageProcess.selectBox}
              style={{
              }}
            />
            {
            }
          </>
        }
      </div>
    </div>
  );
});

export default Content;

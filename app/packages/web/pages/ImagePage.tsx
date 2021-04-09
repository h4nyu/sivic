import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Map } from "immutable";
import ImageView from "@sivic/web/components/ImageView";
import store from "@sivic/web/store";
import CharPlot from "@sivic/web/components/CharPlot";
import SvgCharPlot from "@sivic/web/components/SvgCharPlot"
import CropedBox from "@sivic/web/components/CropedBox"

const Content = observer(() => {
  const { imageProcess, editor } = store;
  return (
    <div
      className="box"
      style={{
        display: "grid",
        gridTemplateRows: "auto 2fr 1fr",
        height: "100%",
      }}
    >
      <div className="buttons">
        <a className="button is-info is-light" onClick={imageProcess.fetchBoxes}>
          Auto Fill
        </a>
        <a className="button is-info is-light" onClick={imageProcess.fetchBoxes}>
          Save
        </a>
      </div>
      <div
        tabIndex={0}
        onKeyDown={e => {
          if (e.keyCode === 8) {
            editor.del()
          }
        }}
        style={{
          overflow:"scroll",
          display: "grid",
          alignItems: "center",
        }}
      >
        {
          imageProcess.image &&  
            <SvgCharPlot 
              data={imageProcess.image.data} 
              boxes={editor.boxes}
              mode={editor.mode}
              selectedId={editor.draggingId}
              onSelect={editor.toggleDrag}
              onAdd={editor.add}
              onMove={editor.move}
              onLeave={editor.del}
              size={editor.size}
              width={1024}
          />
        }
      </div>
      <div
        style={{
          overflow:"scroll",
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        {
          editor.boxes.toList().map(b => (
            <div
              className="card m-1"
              style={{
                width: 50,
                height: 50,
              }}
            >
              <CropedBox 
                box={b}
                data={imageProcess.image?.data}
                style={{
                  maxWidth:"100%",
                  maxHeight:"100%"
                }}
              />
            </div>
          ))
        }
      </div>
    </div>
  );
});

export default Content;

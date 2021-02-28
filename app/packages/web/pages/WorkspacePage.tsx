import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { Map } from "immutable";
import FileUpload from "@charpoints/web/components/FileUpload";
import store from "@sivic/web/store";
import {
  useParams
} from "react-router-dom";

import { Image } from "@sivic/core/image";
import ImageTable from "@sivic/web/components/ImageTable"
import ImageTags from "@sivic/web/components/ImageTags";


const Content = observer(() => {
  let { id } = useParams<{id:string}>();
  const { workspaceForm, imageProcess, workspaceStore } = store
  const { save } = store.workspaceForm;
  return (
    <div
      className="box"
      style={{
        display: "grid",
        gridTemplateRows: "auto 1fr 110px",
        width: "100%",
        height: "100%",
      }}
    >
      <div className="field" 
        style={{ 
          gridRow: "1",
          height: "100%",
        }}
      >
        <label className="label">Name</label>
        <div className="control" >
          <input 
            className="input" 
            type="text" 
            value={store.workspaceForm.name} 
            onChange={e => store.workspaceForm.setName(e.target.value)}
          />
        </div>
      </div>
      <div 
        style={{
          gridRow: "2"
        }}
      >
        <label className="label">Image List</label>
        <ImageTable
          images={workspaceForm.imageForm.images}
          onClick={(id) => imageProcess.init(workspaceForm.id, id)}
          onDelete={workspaceForm.imageForm.deleteImage}
          TagComponent={(props:{image:Image}) => <ImageTags image={props.image} onClick={workspaceForm.imageForm.updateTag}/>}
        />
      </div>
      <div 
        style={{
          gridRow: "3"
        }}
      >
        <FileUpload
          accept={"application/json, image/*"}
          onChange={store.imageForm.uploadFiles}
        />
      </div>
    </div>
  );
});

export default Content;

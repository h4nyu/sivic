import React, { useRef, RefObject, useState, useEffect } from "react";
import { Image } from "@sivic/core/image";
import { Workspace } from "@sivic/core/workspace";

export const ImageView = (props: {
  workspace:Workspace,
  image: Image,
  boxImages?:Image[]
}) => {
  const { workspace, image, boxImages } = props
  return (
    <div
      className="card"
    >
      <div className= "card-header">
        <p className="card-header-title">
          {workspace.name} / {image.name}
        </p>
      </div>
      <div className="card-content">
        <div className="content">
          {
            boxImages && boxImages.map(x => {
              return (
                <div>
                  aaaaa
                </div>
              )
            })
          }
        </div>
      </div>
    </div>
  );
};
export default ImageView;

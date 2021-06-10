import React, { useRef, RefObject, useState, useEffect } from "react";
import { Image } from "@sivic/core/image";
import { Workspace } from "@sivic/core/workspace";
import ImageView from "@sivic/web/components/ImageView";

export const BoxView = (props: {
  image: Image,
  boxImages?:Image[]
}) => {
  const { image, boxImages } = props
  return (
    <div
      className="card"
    >
      <div className= "card-header">
        <p className="card-header-title">
          {image.name}
        </p>
      </div>
      <div className="card-content">
        <div className="content" style={{display:"flex", flexDirection:"row", flexWrap:"wrap"}}>
          {
            boxImages && boxImages.map((x, i) => {
              return (
                <div key={i} className='p-1'>
                  <img src={`data:image/png;base64, ${x.data}`} width={50} height={50}/>
                </div>
              )
            })
          }
        </div>
      </div>
    </div>
  );
};
export default BoxView;

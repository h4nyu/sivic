import React, { useRef, RefObject, useState, useEffect } from "react";
import { Image } from "@sivic/core/image";
import { Workspace } from "@sivic/core/workspace";
import DateView from "@sivic/web/components/DateView";
import ImageView from "@sivic/web/components/ImageView";
import DeleteBtn from "@sivic/web/components/DeleteBtn";
import ImageTags from "@sivic/web/components/ImageTags";

export const BoxView = (props: {
  image: Image,
  images?:Image[]
  onNameClick?: (imageId:string) => void
  onTagClick?: ({id: string, tag:ImageTag}) => void;
  onBoxClick?:(id: string) => void;
  onDeleteClick?: (imageId: string) => void
}) => {
  const boxImages = props.images?.filter(x => x.parentId === props.image.id) || []
  return (
    <div
      className="card"
    >
      <div className= "card-header"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto auto auto",
          alignItems: "center",
        }}
      >
        <p className={`card-header-title ${props.onNameClick ? "is-clickable" : ""}` }
          onClick={() => props.onNameClick && props.onNameClick(props.image.id)}
        >
          {props.image.name}
        </p>
        <DateView value={props.image.createdAt} />
        <div className="pl-2">
          <ImageTags 
            image={props.image} 
            onClick={props.onTagClick}
          />
        </div>
        {
          props.onDeleteClick && 
            <div className="p-2">
              <DeleteBtn onClick={() => props.onDeleteClick && props.onDeleteClick(props.image.id)} /> 
            </div>
        }
      </div>
      <div className="card-content">
        <div className="content" style={{display:"flex", flexDirection:"row", flexWrap:"wrap"}}>
          {
            boxImages.map((x, i) => {
              return (
                <div key={i} className={`p-1 ${props.onBoxClick ? "is-clickable" : ""}`}>
                  <img src={`data:image/png;base64, ${x.data}`} width={50} height={50} onClick={() => props.onBoxClick && props.onBoxClick(x.id)}/>
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

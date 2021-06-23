import React from "react";
import { Image, ImageTag } from "@sivic/core/image";

const Tags = (props:{
  image:Image
  onClick?: ({id: string, tag:ImageTag}) => void;
}) => {
  const { image, onClick } = props;
  const { id, tagId } = image
  return <div> TODO </div>
  // return (
  //   <div className="buttons has-addons m-0">
  //     <button className={`button is-small m-0 ${tag === "Source" ? "is-success" : ""}`} onClick={() => onClick && onClick({id, tag:ImageTag.Source})}>Source</button>
  //     <button className={`button is-small m-0 ${tag === "Target" ? "is-info" : ""}`} onClick={() => onClick && onClick({id, tag:ImageTag.Target})}>Target</button>
  //   </div>
  // );
};
export default Tags;

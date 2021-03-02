import React from "react";
import { Image, ImageTag } from "@sivic/core/image";

const Tags = (props:{
  image:Image
  onClick?: ({id: string, tag:ImageTag}) => void;
}) => {
  const { image, onClick } = props;
  const { id, tag } = image
  return (
    <div className="buttons has-addons">
      <button className={`button is-small ${tag === "Source" ? "is-success" : ""}`} onClick={() => onClick && onClick({id, tag:ImageTag.Source})}>Source</button>
      <button className={`button is-small ${tag === "Target" ? "is-info" : ""}`} onClick={() => onClick && onClick({id, tag:ImageTag.Target})}>Target</button>
    </div>
  );
};
export default Tags;

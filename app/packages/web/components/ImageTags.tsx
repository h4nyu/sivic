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
      <button className={tag === "Source" ? "button is-success" : "button"} onClick={() => onClick && onClick({id, tag:ImageTag.Source})}>Source</button>
      <button className={tag === "Target" ? "button is-info" : "button"} onClick={() => onClick && onClick({id, tag:ImageTag.Target})}>Target</button>
    </div>
  );
};
export default Tags;

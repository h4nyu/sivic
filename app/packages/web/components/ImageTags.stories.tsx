import React from "react";
import ImageTags from "./ImageTags";
import { Image as ChartImage } from "@sivic/core/image";

const charImage = ChartImage();
const image = {
  ...charImage,
  tag: "Target"
}
export default {
  title: "ImageTags",
  component: ImageTags,
};

export const Primary = (args) =>( <ImageTags {...args} image={image}/> )

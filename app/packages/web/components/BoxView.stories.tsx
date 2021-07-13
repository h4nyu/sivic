import React from "react";
import BoxView from "./BoxView";
import { action } from "@storybook/addon-actions";
import { boolean } from "@storybook/addon-knobs";
import { Image } from "@sivic/core/image";
import { File } from "@sivic/core/file";
import { Workspace } from "@sivic/core/workspace";
import { range } from "lodash";

// @ts-ignore
import { data as imageData } from "@sivic/web/data/image.json" 

const workspace = Workspace({
  name: "WorkspaceName"
})

const files = [
  File({
    id: "f0",
    data: imageData,
  })
]
const image = Image({
  name: "ImageName",
  fileId: "f0",
})
const images = range(10).map(x => {
  return image
})

export default {
  title: "BoxView",
  component: BoxView
};

export const Basic = (args) => (
  <BoxView 
    {...args} 
    workspace={workspace} 
    image={image} 
    boxImages={images}
    files={files}
  />
)


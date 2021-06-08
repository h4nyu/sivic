
import React from "react";
import BoxView from "./BoxView";
import { action } from "@storybook/addon-actions";
import { boolean } from "@storybook/addon-knobs";
import { Image } from "@sivic/core/image";
import { Workspace } from "@sivic/core/workspace";

// @ts-ignore
import imageData from "@charpoints/web/data/imageData.txt" 

const workspace = {
  ...Workspace(),
  name: "WorkspaceName"
}

const image = {
  ...Image(),
  name: "ImageName"
}

export default {
  title: "BoxView",
  component: BoxView
};

export const Basic = (args) => <BoxView {...args} workspace={workspace} image={image}/>;


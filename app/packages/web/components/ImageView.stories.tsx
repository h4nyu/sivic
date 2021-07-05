import React from "react";
import ImageView from "./ImageView";
import { action } from "@storybook/addon-actions";
import { boolean } from "@storybook/addon-knobs";
import { Image } from "@sivic/core/image";

// @ts-ignore
import { data as imageData } from "@sivic/web/data/image.json" 

export default {
  title: "ImageView",
  component: ImageView
};

export const Basic = (args) => <ImageView {...args} imageData={imageData} />;

export const Large = (args) => <ImageView {...args} imageData={imageData} size={512} />;

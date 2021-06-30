import React from "react";
import Component from "./CropedBox";
import store from "../store";
import { Map } from "immutable";
import { Box } from "@sivic/core/box"
import annot from "/srv/data/annto.json";

const { imageData } = annot;

export default {
  title: "CropedBox",
  component: Component,
};

export const Large = (args) => (
  <Component
    {...args}
    data={imageData}
    box={Box({x0: 30, y0: 30, x1: 80, y1: 80,})}
  />
);

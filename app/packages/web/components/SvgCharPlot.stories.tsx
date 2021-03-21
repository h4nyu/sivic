import React from "react";
import Component from "./SvgCharPlot";
import store from "../store";
import { Image, Box, Point } from "@charpoints/web/store";
import { Map } from "immutable";
import annot from "/srv/data/annto.json";

const { imageData } = annot;

export default {
  title: "SvgCharPlot",
  component: Component,
};

const boxes = Map(
  [
    { ...Box(), x0: 10, y0: 10, x1: 50, y1: 50, confidence: 0.9 },
  ].map((x, i) => [`${i}`, x])
);

export const Large = (args) => (
  <Component
    {...args}
    data={imageData}
    boxes={boxes}
  />
);

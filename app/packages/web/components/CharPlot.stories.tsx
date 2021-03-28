import React from "react";
import Component from "./CharPlot";
import store from "../store";
import { Image, Box, Point } from "@charpoints/web/store";
import { Map } from "immutable";
import annot from "/srv/data/annto.json";

const { imageData } = annot;

export default {
  title: "CharPlot",
  component: Component,
};

const boxes = Map(
  [
    { ...Box(), x0: 10, y0: 10, x1: 50, y1: 50, confidence: 0.9 },
    { ...Box(), x0: 30, y0: 30, x1: 70, y1: 70, confidence: 0.9 },
  ].map((x, i) => [`${i}`, x])
);

export const Large = (args) => (
  <Component
    {...args}
    selectedId={"1"}
    data={imageData}
    boxes={boxes}
  />
);

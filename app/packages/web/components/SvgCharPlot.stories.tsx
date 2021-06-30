import React from "react";
import Component from "./SvgCharPlot";
import { Box } from "@sivic/core/box";
import { Point } from "@sivic/core/point";
import { Map } from "immutable";
import annot from "/srv/data/annto.json";
import {UncontrolledReactSVGPanZoom} from 'react-svg-pan-zoom';

const { imageData } = annot;

export default {
  title: "SvgCharPlot",
  component: Component,
};
const boxes = Map(
  [
    { ...Box(), x0: 10, y0: 10, x1: 20, y1: 20, confidence: 0.1 },
  ].map((x, i) => [`${i}`, x])
);

const points = Map(
  [
    Point({x: 30,  y: 80}),
  ].map((x, i) => [`${i}`, x])
);
const line = [ {...Point(), x:10, y:10 }, {...Point(), x:50, y:50} ]

export const Primary = (args) => (
  <Component {...args} data={imageData} />
);

export const Large = (args) => (
  <Component
    {...args}
    data={imageData}
    size={512}
    boxes={boxes}
  />
);

export const WithPoint = (args) => (
  <Component
    {...args}
    data={imageData}
    size={512}
    points={points}
    line={line}
  />
);

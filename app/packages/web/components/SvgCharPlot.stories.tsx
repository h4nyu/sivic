import React from "react";
import Component from "./SvgCharPlot";
import { Box, Boxes, InputMode } from "@charpoints/web/store";
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

export const PanAndZoom = (args) => {
  const Viewer = React.useRef(null);
  return (
    <UncontrolledReactSVGPanZoom
      ref={Viewer}
      width={500} height={500}
      onZoom={e => console.log('zoom')}
      onPan={e => console.log('pan')}
      onClick={event => console.log('click', event.x, event.y, event.originalEvent)}
    >
      <Component
        {...args}
        data={imageData}
        size={512}
        boxes={boxes}
      />
    </UncontrolledReactSVGPanZoom>
  );
}

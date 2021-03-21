import React, { RefObject, useRef, useEffect, useState } from "react";
import { Points, Box, Boxes, InputMode } from "@charpoints/web/store";

export const SvgCharPlot = (props: {
  data?: string;
  boxes?: Box[];
  style?:React.CSSProperties,
}) => {
  const {
    data,
    boxes,
    style,
  } = props;
  if (data === undefined) {
    return null;
  }
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const canvasRef:RefObject<HTMLCanvasElement> = useRef(null);
  const drawBoxes = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if(!ctx){ return }
    ctx.strokeStyle = "#FF0000"
    ctx.fillStyle = "#FF0000";
    boxes?.forEach((b, i) => {
      ctx.strokeRect(b.x0, b.y0, b.x1 - b.x0, b.y1 - b.y0);
      const edges = [
        [b.x0, b.y0],
        [b.x0, b.y1],
        [b.x1, b.y0],
        [b.x1, b.y1],
      ].forEach(p => {
        ctx.beginPath();
        ctx.arc(p[0], p[1], 3, 0, 2 * Math.PI);
        ctx.fill();
      })
    })
  }

  useEffect(() => {
    const image = new Image();
    image.src = `data:image;base64,${data}`;
    image.onload = () => {
      const canvas = canvasRef.current;
      if(!canvas){return}
      const ctx = canvas.getContext('2d');
      setWidth(image.width);
      setHeight(image.height);
      if(ctx){
        ctx.drawImage(image, 0, 0);
        drawBoxes()
      }
    }
  }, [data]);
  drawBoxes()

  return (
    <canvas 
      style={{width:width, height:height, ...style}}
      ref={canvasRef}
      width={width}
      height={height}
    />
  );
};
export default SvgCharPlot;

import React, { RefObject, useRef, useEffect, useState } from "react";
import { Points, Box, Boxes, InputMode } from "@charpoints/web/store";
import { Map, List } from "immutable";

export const SvgCharPlot = (props: {
  data?: string;
  boxes?: Map<string, Box>;
  lineWidth?:number;
  selectedId?: string; 
  onBoxClick?: (id: string) => void;
  style?:React.CSSProperties,
}) => {
  const {
    data,
    boxes,
    selectedId,
    onBoxClick,
    style,
  } = props;
  if (data === undefined) {
    return null;
  }
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const canvasRef:RefObject<HTMLCanvasElement> = useRef(null);
  const lineWidth = props.lineWidth !== undefined ? props.lineWidth : 3
  const drawBoxes = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if(!ctx){ return }
    ctx.strokeStyle = "#FF0000"
    ctx.fillStyle = "#FF0000";
    boxes?.forEach((b, id) => {
      ctx.lineWidth = lineWidth;
      ctx.strokeRect(b.x0, b.y0, b.x1 - b.x0, b.y1 - b.y0);
      ctx.fillText(`${b.confidence}`, b.x0, b.y0);
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
      if(selectedId === id){
        ctx.globalAlpha = 0.2;
        ctx.fillRect(b.x0, b.y0, b.x1 - b.x0, b.y1 - b.y0);
      }
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
  const handleClick = (e) => {
    if(!onBoxClick){return}
    const rect = e.target.getBoundingClientRect();
    const [x, y] = [e.clientX - rect.left, e.clientY - rect.top];
    for(const [id, b] of boxes || Map()){
      const canvas = canvasRef.current;
      if(!canvas){return}
      if(b.x0 <= x && x <= b.x1 && b.y0 < y && y <= b.y1){
        onBoxClick(id)
      }else{
        console.log()

      }
    }
  }
  drawBoxes()

  return (
    <canvas 
      style={props.style}
      ref={canvasRef}
      onClick={handleClick}
      width={width}
      height={height}
    />
  );
};
export default SvgCharPlot;

import React, {useRef, useState, RefObject} from 'react';
import { Box } from "@sivic/core/box"

export default function(props:{
  box: Box,
  data?: string,
  onLoad?: (data:string) => void,
  onClick?: () => void;
  style?:React.CSSProperties,
}){
  const canvasRef:RefObject<HTMLCanvasElement> = useRef(null);
  const {box, data, onLoad, onClick, style} = props;
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  React.useEffect(() => {
    const image = new Image();
    image.src = `data:image;base64,${data}`;
    image.onload = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      const height = box.y1 - box.y0
      const width = box.x1 - box.x0
      setHeight(height)
      setWidth(width)
      ctx?.drawImage(
        image, 
        box.x0, box.y0, width, height, 
        0, 0, width, height 
      );
      if(onLoad){
        const png = canvas?.toDataURL();
        if(png){
          onLoad(png)
        }
      }
    }
  }, [data, box])

  return (
    <div onClick={() => onClick && onClick()}>
      <canvas 
        style={props.style}
        ref={canvasRef}
        width={width}
        height={height}
      />
    </div>
  )
}

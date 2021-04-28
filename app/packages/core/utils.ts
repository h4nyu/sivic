import { range, values, uniq, first, sortBy  } from 'lodash'

// TODO import charpoints
type Point = {
  x: number;
  y: number;
  imageId: string;
  label?: string;
  confidence?: number;
  isGrandTruth?: boolean;
};

export const Point = (): Point => {
  return {
    x: 0,
    y: 0,
    imageId: "",
    label: undefined,
  };
};

const combinations = (size0:number, size1:number) =>  {
  const souceIds = range(size0)
  const targetIds = range(size1)
  let res: [number, number][] = []
  for (const s of souceIds){
    for (const t of targetIds){
      res.push([s, t])
    }
  }
  return uniq(res)
}

type Line = [ Point, Point ]

export const getBaseline = (points: Point[]): undefined | Line =>
{
  let preDistance = 0
  const combPaints = combinations(points.length, points.length)
  .filter( x => x[0] !== x[1])
  .map(x => {
    return [points[x[0]], points[x[1]]]
  })
  .map(p => {
    return [ p, Math.sqrt( Math.pow( p[1].x -p[0].x, 2 ) + Math.pow( p[1].y -p[0].y, 2 ))]
  })

  const line = first(sortBy(combPaints, x => - x[1]).map(p => p[0]))
  return line as any
}

export const rotatePoint = (point: Point, originPoint:Point, angle:number):Point => {
    angle = angle * Math.PI / 180.0;
    const x = Math.cos(angle) * (point.x- originPoint.x) - Math.sin(angle) * (point.y - originPoint.x) + originPoint.x
    const y = Math.sin(angle) * (point.x-originPoint.x) + Math.cos(angle) * (point.y- originPoint.y) + originPoint.y 
    return { ...point, x, y }
}

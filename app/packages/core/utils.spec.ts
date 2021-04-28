import {
  rotatePoint, getBaseline, Point
} from "@sivic/core/utils";

describe("spec", () => {
  test("getBaseline", async () => {
    const points = [
      {...Point(), x:0, y:0},
      {...Point(), x:2, y:2},
      {...Point(), x:5, y:5}
    ]
    const baseline = getBaseline(points)
    console.log(baseline)
    expect(baseline).toEqual([
      {...Point(), x:0, y:0},
      {...Point(), x:5, y:5}
    ])
  });
  test("getBaseline", async () => {
    const point = {...Point(), x:5, y:1}
    const originPoint = {...Point(), x:1, y:1}
    const res = rotatePoint(point, originPoint, 90)
    expect(res).toEqual(
      {...Point(), x:1, y:5},
    )
  });
});

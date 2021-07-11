import {
  rotatePoint, getBaseline
} from "@sivic/core/utils";
import { Point } from "@sivic/core/point"

describe("spec", () => {
  test("getBaseline", async () => {
    const points = [
<<<<<<< HEAD
      Point({x:0, y:0}), 
      Point({x:2, y:2}), 
      Point({x:5, y:5}),
||||||| 8826f25
      {...Point(), x:0, y:0},
      {...Point(), x:2, y:2},
      {...Point(), x:5, y:5}
=======
      Point({ x:0, y:0}),
      Point({ x:2, y:2}),
      Point({ x:5, y:5})
>>>>>>> 3017da5db2033f62c5f4cd2e94d23baf74dde6ae
    ]
    const baseline = getBaseline(points)
    expect(baseline).toEqual([
<<<<<<< HEAD
      Point({
        x:0, y:0
      }),
      Point({
        x:5, y:5
      })
||||||| 8826f25
      {...Point(), x:0, y:0},
      {...Point(), x:5, y:5}
=======
      Point({x:0, y:0}),
      Point({x:5, y:5})
>>>>>>> 3017da5db2033f62c5f4cd2e94d23baf74dde6ae
    ])
  });
  test("getBaseline", async () => {
    const point = Point({x:5, y:1})
    const originPoint = Point({ x:1, y:1})
    const res = rotatePoint(point, originPoint, 90)
    expect(res).toEqual(
      Point({x:1, y:5}),
    )
  });
});

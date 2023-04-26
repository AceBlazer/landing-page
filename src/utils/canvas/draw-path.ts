/*
  Draw a path using lines on the provided canvas 2d context.
  Assumes origin is in the center of the path points when apply the inset.
  ---
  ctx             context2D     Canvas context to draw upon
  path            Array         Serial coordinates that form path [x0, y0, x1, y1, ...]
*/

import sign from "../math/sign";

export default function drawPath(
  ctx: CanvasRenderingContext2D,
  path: number[],
  inset = 0
) {
  ctx.beginPath();

  for (let i = 0, l = path.length; i < l; i += 2) {
    const x = path[i] - 0.5 + sign(path[i]) * -inset;
    const y = path[i + 1] - 0.5 + sign(path[i + 1]) * -inset;

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
}

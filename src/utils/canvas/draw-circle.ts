/*
  Draw a circle on the provided canvas 2d context.
  By default a closed unit circle is drawn at the origin.
  ---
  ctx             context2D     Canvas context to draw upon
  x               Number        X position at circle center
  y               Number        Y position at circle center
  radius          Number        Radius of circle
  startAngle      Number        Start angle (in Radians)
  endAngle        Number        End angle (in Radians)
  anticlockwise   Boolean       Anti-clockwise flag
*/

export default function drawCircle(
  ctx: CanvasRenderingContext2D,
  x = 0,
  y = 0,
  radius = 1,
  startAngle = 0,
  endAngle: number = Math.PI * 2,
  anticlockwise = false
) {
  ctx.beginPath();
  ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise);
  // Close path if the arc forms a full circle
  if (Math.abs(endAngle - startAngle) >= Math.PI * 2) ctx.closePath();
}

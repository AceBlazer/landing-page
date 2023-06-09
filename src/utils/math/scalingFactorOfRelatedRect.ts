/*
    Calculate the scaling factor of a rotated rectangle
    https://math.stackexchange.com/a/438573
    ---
    width     Number      Width of rotated rect
    height    Number      Height of rotated rect
    theta     Number      Angle of rotation in radians
    ---
    Returns   Number      'k', the scaling factor of the outer bounding rect
*/

export default function scalingFactorOfRotatedRect(
  width: number,
  height: number,
  theta: number
) {
  return Math.cos(theta) + (width / height) * Math.sin(theta);
}

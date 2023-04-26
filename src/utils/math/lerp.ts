/*
    Lerp (Linear Interpolate) between 2 values
    ---
    a          Number      First value
    b          Number      Second value
    alpha      Number      Normalized 'alpha' value between 2 values (from 0-1)
    ---
    Returns    Number      Interpolated value
*/

export default function (a: number, b: number, alpha = 0.5) {
  return a + alpha * (b - a);
}

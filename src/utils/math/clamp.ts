/*
  Return numerical value clamped to supplied range
  ---
  val        Number      Value to clamp
  min        Number      Minimum value to return
  max        Number      Maximum value to return
  ---
  Returns    Number      Clamped value
*/

export default function (val: number, min: number, max: number) {
  return Math.min(Math.max(val, min), max);
}

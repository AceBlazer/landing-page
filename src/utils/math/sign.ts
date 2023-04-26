/*
    Extract the sign from the supplied value, including zero
    Essentially a polyfill for the poorly supported Math.sign()
    ---
    val       Number     Value to extract sign from
    ---
    Returns   Number     Unit sign value (-1, 0, or 1)
*/

export default function (val: number) {
  return val === 0 ? 0 : val > 0 ? 1 : -1;
}

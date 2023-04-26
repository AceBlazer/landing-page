/* eslint-disable */

// UUID as used in Three.js
// https://github.com/mrdoob/three.js/blob/dev/src/math/Math.js
export default function uuid() {
  const lut: string[] = [];

  for (let i = 0; i < 256; i++) {
    lut[i] = (i < 16 ? "0" : "") + i.toString(16);
  }

  return (function generateUUID() {
    // tslint:disable-next-line: no-bitwise
    const d0 = (Math.random() * 0xffffffff) | 0;
    // tslint:disable-next-line: no-bitwise
    const d1 = (Math.random() * 0xffffffff) | 0;
    // tslint:disable-next-line: no-bitwise
    const d2 = (Math.random() * 0xffffffff) | 0;
    // tslint:disable-next-line: no-bitwise
    const d3 = (Math.random() * 0xffffffff) | 0;
    const uuidValue =
      // tslint:disable-next-line: no-bitwise
      lut[d0 & 0xff] +
      // tslint:disable-next-line: no-bitwise
      lut[(d0 >> 8) & 0xff] +
      // tslint:disable-next-line: no-bitwise
      lut[(d0 >> 16) & 0xff] +
      // tslint:disable-next-line: no-bitwise
      lut[(d0 >> 24) & 0xff] +
      "-" +
      // tslint:disable-next-line: no-bitwise
      lut[d1 & 0xff] +
      // tslint:disable-next-line: no-bitwise
      lut[(d1 >> 8) & 0xff] +
      "-" +
      // tslint:disable-next-line: no-bitwise
      lut[((d1 >> 16) & 0x0f) | 0x40] +
      // tslint:disable-next-line: no-bitwise
      lut[(d1 >> 24) & 0xff] +
      "-" +
      // tslint:disable-next-line: no-bitwise
      lut[(d2 & 0x3f) | 0x80] +
      // tslint:disable-next-line: no-bitwise
      lut[(d2 >> 8) & 0xff] +
      "-" +
      // tslint:disable-next-line: no-bitwise
      lut[(d2 >> 16) & 0xff] +
      // tslint:disable-next-line: no-bitwise
      lut[(d2 >> 24) & 0xff] +
      // tslint:disable-next-line: no-bitwise
      lut[d3 & 0xff] +
      // tslint:disable-next-line: no-bitwise
      lut[(d3 >> 8) & 0xff] +
      // tslint:disable-next-line: no-bitwise
      lut[(d3 >> 16) & 0xff] +
      // tslint:disable-next-line: no-bitwise
      lut[(d3 >> 24) & 0xff];

    return uuidValue.toUpperCase();
  })();
}

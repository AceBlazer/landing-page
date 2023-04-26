/*
    Penner's EasingFn equations adapted to accept a single normalized alpha value
    ---
    a          Number      normalized 'alpha' value (from 0-1)
    ---
    Returns    Number      alpha value with EasingFn applied
*/

// Linear
// ------

export type EasingFn = (a: number) => number;

export const linear: EasingFn = (a) => {
  return a;
};

// Sine
// ----

export const inSine: EasingFn = (a) => {
  return -1 * Math.cos(a * (Math.PI / 2)) + 1;
};

export const outSine: EasingFn = (a) => {
  return 1 * Math.sin(a * (Math.PI / 2));
};

export const inOutSine: EasingFn = (a) => {
  return -0.5 * (Math.cos((Math.PI * a) / 1) - 1);
};

// Quad
// ----

export const inQuad: EasingFn = (a) => {
  return a * a;
};

export const outQuad: EasingFn = (a) => {
  return -1 * a * (a - 2);
};

export const inOutQuad: EasingFn = (a) => {
  a /= 0.5;
  if (a < 1) {
    return 0.5 * a * a;
  }
  a--;
  return -0.5 * (a * (a - 2) - 1);
};

// Cubic
// -----

export const inCubic: EasingFn = (a) => {
  return a * a * a;
};

export const outCubic: EasingFn = (a) => {
  a--;
  return a * a * a + 1;
};

export const inOutCubic: EasingFn = (a) => {
  a /= 0.5;
  if (a < 1) {
    return 0.5 * a * a * a;
  }
  a -= 2;
  return 0.5 * (a * a * a + 2);
};

// Quart
// -----

export const inQuart: EasingFn = (a) => {
  return a * a * a * a;
};

export const outQuart: EasingFn = (a) => {
  a--;
  return -1 * (a * a * a * a - 1);
};

export const inOutQuart: EasingFn = (a) => {
  a /= 0.5;
  if (a < 1) {
    return 0.5 * a * a * a * a;
  }
  a -= 2;
  return -0.5 * (a * a * a * a - 2);
};

// Quint
// -----

export const inQuint: EasingFn = (a) => {
  return a * a * a * a * a;
};

export const outQuint: EasingFn = (a) => {
  a--;
  return a * a * a * a * a + 1;
};

export const inOutQuint: EasingFn = (a) => {
  a /= 0.5;
  if (a < 1) {
    return 0.5 * a * a * a * a * a;
  }
  a -= 2;
  return 0.5 * (a * a * a * a * a + 2);
};

// Expo
// ----

export const inExpo: EasingFn = (a) => {
  return Math.pow(2, 10 * (a - 1));
};

export const outExpo: EasingFn = (a) => {
  return -Math.pow(2, -10 * a) + 1;
};

export const inOutExpo: EasingFn = (a) => {
  a /= 0.5;
  if (a < 1) {
    return 0.5 * Math.pow(2, 10 * (a - 1));
  }
  a--;
  return 0.5 * (-Math.pow(2, -10 * a) + 2);
};

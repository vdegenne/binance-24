export function round(value: number, precision = 2) {
  return Math.round(value * (10 ** precision)) / (10 ** precision);
}

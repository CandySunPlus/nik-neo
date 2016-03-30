export function intRgbToHex(intRgb) {
  return '#' + [16, 8, 0].map(shift => {
    let mask = 0xff << shift;
    let hex = ((intRgb & mask) >> shift).toString(16);
    return hex.length < 2 ? `0${hex}` : hex;
  }).join('');
}

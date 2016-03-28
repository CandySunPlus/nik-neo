/**
 * Created by niksun on 16/3/28.
 */

export function getColorString(rgb) {
  let bgr = new Array(3);
  for (let [index, _] of bgr.entries()) {
    bgr[index] = rgb & 0xff;
    rgb = rgb >> 8;
  }
  return `rgb(${bgr.reverse().join(',')})`;
}

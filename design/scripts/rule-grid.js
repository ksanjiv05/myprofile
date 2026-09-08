/**
 * Digital Pattern — graph / ruled paper hairlines.
 *
 * @schema 2.10
 * @input pitch: number = 24
 * @input thickness: number = 1
 * @input axis: enum("both", "horizontal", "vertical") = "both"
 * @input color: color = #D6D2C4
 */
const w = pencil.width;
const h = pencil.height;
const pitch = Math.max(4, pencil.input.pitch);
const t = Math.max(0.25, pencil.input.thickness);
const axis = pencil.input.axis;

let d = "";
if (axis !== "vertical") {
  for (let y = 0; y <= h; y += pitch) {
    d += `M 0 ${y.toFixed(2)} H ${w.toFixed(2)} V ${(y + t).toFixed(2)} H 0 Z `;
  }
}
if (axis !== "horizontal") {
  for (let x = 0; x <= w; x += pitch) {
    d += `M ${x.toFixed(2)} 0 V ${h.toFixed(2)} H ${(x + t).toFixed(2)} V 0 Z `;
  }
}

return [{
  type: "path",
  name: "Rule grid",
  x: 0, y: 0, width: w, height: h,
  viewBox: [0, 0, w, h],
  geometry: d.trim(),
  fill: pencil.input.color,
}];

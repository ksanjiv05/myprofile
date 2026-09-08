/**
 * Digital Pattern — uniform dot grid.
 * Emits ONE path node containing every dot, so the canvas stays cheap.
 *
 * @schema 2.10
 * @input pitch: number = 24
 * @input dotSize: number = 1.5
 * @input color: color = #A9A395
 */
const w = pencil.width;
const h = pencil.height;
const pitch = Math.max(4, pencil.input.pitch);
const r = Math.max(0.25, pencil.input.dotSize / 2);

let d = "";
for (let y = pitch / 2; y < h; y += pitch) {
  for (let x = pitch / 2; x < w; x += pitch) {
    const x0 = (x - r).toFixed(2);
    const yy = y.toFixed(2);
    d += `M ${x0} ${yy} a ${r} ${r} 0 1 0 ${(2 * r).toFixed(2)} 0 a ${r} ${r} 0 1 0 ${(-2 * r).toFixed(2)} 0 `;
  }
}

return [{
  type: "path",
  name: "Dot grid",
  x: 0, y: 0, width: w, height: h,
  viewBox: [0, 0, w, h],
  geometry: d.trim(),
  fill: pencil.input.color,
}];

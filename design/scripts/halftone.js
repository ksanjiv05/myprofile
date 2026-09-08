/**
 * Digital Pattern — halftone gradient.
 * Dot SIZE carries the tone (print behaviour), never opacity blur.
 *
 * @schema 2.10
 * @input pitch: number = 14
 * @input maxDot: number = 9
 * @input direction: enum("down", "up", "right", "left", "radial") = "down"
 * @input gamma: number = 1.6
 * @input color: color = #14130F
 */
const w = pencil.width;
const h = pencil.height;
const pitch = Math.max(4, pencil.input.pitch);
const maxR = Math.max(0.5, pencil.input.maxDot / 2);
const dir = pencil.input.direction;
const gamma = Math.max(0.2, pencil.input.gamma);
const cx = w / 2;
const cy = h / 2;
const maxDist = Math.hypot(cx, cy) || 1;

function tone(x, y) {
  switch (dir) {
    case "up": return 1 - y / h;
    case "right": return x / w;
    case "left": return 1 - x / w;
    case "radial": return 1 - Math.hypot(x - cx, y - cy) / maxDist;
    default: return y / h;
  }
}

let d = "";
for (let y = pitch / 2; y < h; y += pitch) {
  for (let x = pitch / 2; x < w; x += pitch) {
    const t = Math.pow(Math.min(1, Math.max(0, tone(x, y))), gamma);
    const r = maxR * t;
    if (r < 0.2) continue;
    const rr = r.toFixed(2);
    d += `M ${(x - r).toFixed(2)} ${y.toFixed(2)} a ${rr} ${rr} 0 1 0 ${(2 * r).toFixed(2)} 0 a ${rr} ${rr} 0 1 0 ${(-2 * r).toFixed(2)} 0 `;
  }
}

return [{
  type: "path",
  name: "Halftone",
  x: 0, y: 0, width: w, height: h,
  viewBox: [0, 0, w, h],
  geometry: d.trim(),
  fill: pencil.input.color,
}];

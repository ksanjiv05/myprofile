/**
 * Digital Pattern — monospace character field.
 * A block of glyphs used as texture; one text node per row.
 *
 * @schema 2.10
 * @input rows: number = 14
 * @input cols: number = 48
 * @input fontSize: number = 12
 * @input density: number = 0.55
 * @input charset: string = "01·+—/\\[]{}<>#="
 * @input color: color = #A9A395
 */
const chars = String(pencil.input.charset || "01").split("");
const rows = Math.max(1, Math.floor(pencil.input.rows));
const cols = Math.max(1, Math.floor(pencil.input.cols));
const fs = pencil.input.fontSize;
const lh = Math.round(fs * 1.45);
const density = Math.min(1, Math.max(0, pencil.input.density));

const nodes = [];
for (let r = 0; r < rows; r++) {
  let line = "";
  for (let c = 0; c < cols; c++) {
    line += Math.random() < density ? chars[Math.floor(Math.random() * chars.length)] : " ";
  }
  nodes.push({
    type: "text",
    name: `row-${r}`,
    x: 0,
    y: r * lh,
    content: line,
    fontFamily: "IBM Plex Mono",
    fontSize: fs,
    letterSpacing: 2,
    fill: pencil.input.color,
  });
}
return nodes;

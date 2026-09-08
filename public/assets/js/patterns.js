/* Digital Pattern generators — same algorithms as design/scripts/*.js.
   Halftone is drawn on <canvas>: hundreds of dots cost a few hundred bytes of
   markup instead of a 20KB SVG path, and the ink colour is read from CSS so the
   theme drives it. Uniform dot/rule grids are pure CSS (see tokens.css). */
(function () {
  "use strict";

  /* Emit a placeholder the painter fills in later. */
  function halftone(opts) {
    return '<canvas class="pat pat--halftone" aria-hidden="true" data-pat=\'' +
      JSON.stringify(opts || {}) + "'></canvas>";
  }

  function draw(cv) {
    var o;
    try { o = JSON.parse(cv.getAttribute("data-pat")) || {}; } catch (e) { o = {}; }
    var rect = cv.getBoundingClientRect();
    var w = Math.round(rect.width), h = Math.round(rect.height);
    if (!w || !h) return;

    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = w * dpr; cv.height = h * dpr;
    var ctx = cv.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = getComputedStyle(cv).color;

    var pitch = Math.max(4, o.pitch || 13),
        maxR = Math.max(0.5, (o.maxDot || 9) / 2),
        gamma = Math.max(0.2, o.gamma || 1.6),
        dir = o.direction || "down",
        cx = w / 2, cy = h / 2,
        maxDist = Math.hypot(cx, cy) || 1;

    for (var y = pitch / 2; y < h; y += pitch) {
      for (var x = pitch / 2; x < w; x += pitch) {
        var t;
        switch (dir) {
          case "up": t = 1 - y / h; break;
          case "right": t = x / w; break;
          case "left": t = 1 - x / w; break;
          case "radial": t = 1 - Math.hypot(x - cx, y - cy) / maxDist; break;
          default: t = y / h;
        }
        var r = maxR * Math.pow(Math.min(1, Math.max(0, t)), gamma);
        if (r < 0.15) continue;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 6.2832);
        ctx.fill();
      }
    }
  }

  /* Paint (or repaint) every halftone inside root. */
  function paint(root) {
    var list = (root || document).querySelectorAll("canvas.pat--halftone");
    for (var i = 0; i < list.length; i++) draw(list[i]);
  }

  /* Monospace character field, used as texture on the About plate. */
  function asciiField(rows, cols, charset, density) {
    var chars = (charset || "01·+—/\\[]{}<>#=").split(""), out = [], r, c, line;
    density = density == null ? 0.45 : density;
    for (r = 0; r < rows; r++) {
      line = "";
      for (c = 0; c < cols; c++)
        line += Math.random() < density ? chars[(Math.random() * chars.length) | 0] : " ";
      out.push(line);
    }
    return out.join("\n");
  }

  window.PAT = { halftone: halftone, paint: paint, asciiField: asciiField };
})();

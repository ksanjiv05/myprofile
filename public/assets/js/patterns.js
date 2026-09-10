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

  /* Same, but the tone comes from a photograph instead of a gradient. */
  function halftoneImage(src, opts, alt) {
    return '<canvas class="pat pat--halftone" role="img" aria-label="' +
      (alt || "").replace(/"/g, "&quot;") + '" data-pat-img="' + src +
      '" data-pat=\'' + JSON.stringify(opts || {}) + "'></canvas>";
  }

  var imgCache = {};
  function loadImage(src, cb) {
    if (imgCache[src] !== undefined) { cb(imgCache[src]); return; }
    var im = new Image();
    im.onload = function () { imgCache[src] = im; cb(im); };
    im.onerror = function () { imgCache[src] = null; cb(null); };
    im.src = src;
  }

  /* Is the ink lighter than the ground? In the inverted press the page is dark and
     the ink is pale, so the tone mapping has to flip or the portrait comes out as a
     photographic negative. */
  function inkIsLight(css) {
    var m = /rgba?\((\d+)[,\s]+(\d+)[,\s]+(\d+)/.exec(css || "");
    if (!m) return false;
    return (0.299 * +m[1] + 0.587 * +m[2] + 0.114 * +m[3]) / 255 > 0.5;
  }

  function draw(cv) {
    var o;
    try { o = JSON.parse(cv.getAttribute("data-pat")) || {}; } catch (e) { o = {}; }
    var src = cv.getAttribute("data-pat-img");
    if (src) {
      loadImage(src, function (img) {
        // If the photo cannot load, fall through to the procedural halftone so the
        // plate is never blank.
        if (img) drawPhoto(cv, o, img); else paintProcedural(cv, o);
      });
      return;
    }
    paintProcedural(cv, o);
  }

  /* Dot size carries the photograph's tone — the same rule as every other pattern
     here, applied to real luminance instead of a gradient. */
  function drawPhoto(cv, o, img) {
    var rect = cv.getBoundingClientRect();
    var w = Math.round(rect.width), h = Math.round(rect.height);
    if (!w || !h) return;

    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = w * dpr; cv.height = h * dpr;
    var ctx = cv.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    var ink = getComputedStyle(cv).color;
    ctx.fillStyle = ink;

    var pitch = Math.max(3, o.pitch || 7),
        maxR = Math.max(0.5, (o.maxDot || 8) / 2),
        cols = Math.max(1, Math.ceil(w / pitch)),
        rows = Math.max(1, Math.ceil(h / pitch)),
        flip = inkIsLight(ink),
        // In the inverted press the bright background becomes the densest ink, which
        // swamps the subject. A steeper curve thins it back out.
        gamma = Math.max(0.2, flip ? (o.gammaFlipped || (o.gamma || 1) * 1.8)
                                   : (o.gamma || 1));

    // Let the browser average the photo down to one pixel per dot.
    var buf = document.createElement("canvas");
    buf.width = cols; buf.height = rows;
    var bctx = buf.getContext("2d");
    if (!bctx) return;

    // Cover-fit, biased to a focal point and optionally tightened. A centred crop of
    // a square headshot in a landscape-ish frame cuts the top of the head.
    var fx = o.focusX == null ? 0.5 : o.focusX,
        fy = o.focusY == null ? 0.5 : o.focusY,
        zoom = o.zoom || 1;
    var scale = Math.max(cols / img.width, rows / img.height) * zoom;
    var dw = img.width * scale, dh = img.height * scale;
    bctx.drawImage(img, (cols - dw) * fx, (rows - dh) * fy, dw, dh);

    var data;
    try {
      data = bctx.getImageData(0, 0, cols, rows).data;
    } catch (e) {
      // Reading pixels back fails on a tainted canvas — opening the page over
      // file://, or a cross-origin photo. drawImage still works, so show the
      // photograph rather than silently leaving an empty plate.
      drawPlain(ctx, img, w, h, o);
      return;
    }

    // Pass 1 — tone per cell.
    var n = cols * rows, tones = new Float32Array(n), k;
    for (k = 0; k < n; k++) {
      var i = k * 4;
      var lum = (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255;
      tones[k] = flip ? lum : 1 - lum;       // dark ink on paper vs pale ink on ink
    }

    // Auto-levels. A face lit against a pale wall occupies a narrow slice of the
    // range, so without this the features vanish and only the hair reads. Clip at
    // the 2nd/98th percentile so one bright highlight cannot flatten the rest.
    if (o.levels !== false) {
      var sorted = Array.prototype.slice.call(tones).sort(function (a, b) { return a - b; });
      var lo = sorted[Math.floor(n * 0.02)], hi = sorted[Math.floor(n * 0.98)];
      if (hi - lo > 0.02) {
        for (k = 0; k < n; k++)
          tones[k] = Math.min(1, Math.max(0, (tones[k] - lo) / (hi - lo)));
      }
    }

    // Pass 2 — draw.
    for (var ry = 0; ry < rows; ry++) {
      for (var cx = 0; cx < cols; cx++) {
        var r = maxR * Math.pow(tones[ry * cols + cx], gamma);
        if (r < 0.15) continue;
        ctx.beginPath();
        ctx.arc(cx * pitch + pitch / 2, ry * pitch + pitch / 2, r, 0, 6.2832);
        ctx.fill();
      }
    }
  }

  function paintProcedural(cv, o) {
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

  /* Fallback when pixel readback is blocked: the photo itself, desaturated so it
     still sits inside the paper-and-ink palette. */
  function drawPlain(ctx, img, w, h, o) {
    var fx = o.focusX == null ? 0.5 : o.focusX,
        fy = o.focusY == null ? 0.5 : o.focusY,
        zoom = o.zoom || 1,
        scale = Math.max(w / img.width, h / img.height) * zoom,
        dw = img.width * scale, dh = img.height * scale;
    try { ctx.filter = "grayscale(1) contrast(1.08)"; } catch (e) {}
    ctx.drawImage(img, (w - dw) * fx, (h - dh) * fy, dw, dh);
    try { ctx.filter = "none"; } catch (e) {}
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

  window.PAT = { halftone: halftone, halftoneImage: halftoneImage,
                 paint: paint, asciiField: asciiField };
})();

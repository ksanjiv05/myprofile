/* Paper · Ink — tiny hash-router SPA. No framework, no build step. */
(function () {
  "use strict";
  var D = window.DATA, P = window.PAT;
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };

  var ICON = {
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    out: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17 17 7M9 7h8v8"/></svg>',
    sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>'
  };

  /* ---------- partials ---------- */

  function tags(list) {
    return '<div class="card__tags">' + list.map(function (t) {
      return '<span class="tag">' + esc(t) + "</span>"; }).join("") + "</div>";
  }

  function card(p, i) {
    var band = p.pattern ? P.halftone(p.pattern) : '<span class="pat pattern-dots"></span>';
    var inner =
      '<div class="card__band">' + band + "</div>" +
      '<div class="card__body">' +
        '<div class="card__meta"><span class="meta">' + esc(p.idx) + " / 06</span>" +
          '<span class="meta">' + esc(p.meta) + "</span></div>" +
        '<h3 class="card__title">' + esc(p.title) + "</h3>" +
        '<p class="card__desc">' + esc(p.desc) + "</p>" +
        tags(p.tags) +
        '<span class="card__cta">' + esc(p.cta) + (p.href ? ICON.out : "") + "</span>" +
      "</div>";
    var cls = "card reveal" + (p.muted ? " card--muted" : "");
    return p.href
      ? '<a class="' + cls + '" style="--i:' + (i % 3) + '" href="' + p.href +
        '" target="_blank" rel="noopener noreferrer">' + inner + "</a>"
      : '<div class="' + cls + '" style="--i:' + (i % 3) + '">' + inner + "</div>";
  }

  function row(r, i, link) {
    var inner =
      '<span class="meta">' + esc(r.idx) + "</span>" +
      '<span class="row__t">' + esc(r.title) + "</span>" +
      '<span class="row__desc">' + esc(r.desc) + "</span>" +
      '<span class="meta row__when">' + esc(r.when || "") + "</span>" +
      (link ? ICON.out : "");
    var cls = "row reveal" + (r.muted ? " card--muted" : "");
    return link
      ? '<a class="' + cls + '" style="--i:' + i + '" href="' + link + '" target="_blank" rel="noopener noreferrer">' + inner + "</a>"
      : '<div class="' + cls + '" style="--i:' + i + '">' + inner + "</div>";
  }

  function statsBlock() {
    return '<section class="band"><div class="wrap"><div class="stats">' +
      D.stats.map(function (s, i) {
        return '<div class="stat reveal" style="--i:' + i + '">' +
          '<div class="stat__n" data-count="' + s.value + '">0</div>' +
          '<div class="stat__l label">' + esc(s.label) + "</div></div>";
      }).join("") + "</div></div></section>";
  }

  function ticker() {
    var group = '<div class="ticker__group">' + D.ticker.map(function (t) {
      return '<span class="ticker__item">' + esc(t) + "</span>"; }).join("") + "</div>";
    return '<section class="ticker" aria-hidden="true"><div class="ticker__track">' + group + group + "</div></section>";
  }

  function ctaBlock() {
    return '<section class="cta">' + P.halftone({ pitch: 13, maxDot: 11, direction: "right", gamma: 1.5 }) +
      '<div class="wrap"><div class="cta__in">' +
      '<p class="label reveal">NEXT STEP  ·  REPLIES WITHIN 24H</p>' +
      '<h2 class="reveal" style="--i:1">Have something difficult to build?</h2>' +
      '<p class="reveal" style="--i:2">Send the messy version. I would rather see the real constraints than a tidy brief.</p>' +
      '<form class="form reveal" style="--i:3" onsubmit="return false">' +
      '<label><span class="label">EMAIL</span><input class="field" type="email" placeholder="you@company.com" required></label>' +
      '<button class="btn btn--inverse" type="submit">START A CONVERSATION' + ICON.arrow + "</button>" +
      "</form></div></div></section>";
  }

  /* ---------- views ---------- */

  var views = {
    home: function () {
      return '<section class="hero">' +
        '<div class="pat-host pattern-dots"></div>' +
        '<div class="wrap"><div class="hero__grid">' +
          "<div>" +
            '<span class="eyebrow-row reveal"><i class="dot"></i><span class="label">' + esc(D.identity.availability) + "</span></span>" +
            '<h1 class="reveal" style="--i:1"><span class="line">' + esc(D.identity.headline) + "</span></h1>" +
            '<p class="lead reveal" style="--i:2">' + esc(D.identity.sub) + "</p>" +
            '<div class="hero__actions reveal" style="--i:3">' +
              '<a class="btn btn--primary" href="#/work">VIEW SELECTED WORK' + ICON.arrow + "</a>" +
              '<a class="btn" href="#/about">ABOUT ME</a>' +
            "</div>" +
          "</div>" +
          '<div class="plate plate--hero reveal" style="--i:2">' +
            P.halftone({ pitch: 13, maxDot: 10, direction: "radial", gamma: 1.5 }) +
            '<span class="plate__cross plate__cross--h" style="top:20%"></span>' +
            '<span class="plate__cross plate__cross--h" style="top:80%"></span>' +
            '<span class="plate__cross plate__cross--v" style="left:18%"></span>' +
            '<span class="plate__cross plate__cross--v" style="left:82%"></span>' +
            '<span class="plate__label plate__label--tl">FIG. 01 — SYSTEM DENSITY</span>' +
            '<span class="plate__label plate__label--bl">x: 0—500</span>' +
            '<span class="plate__label plate__label--br">&#916; 13px</span>' +
          "</div>" +
        "</div></div></section>" +
        ticker() + statsBlock() +
        '<section class="sec"><div class="wrap">' +
          '<div class="head"><div>' +
            '<p class="label reveal">SELECTED WORK  ·  003 LIVE  ·  002 IN PROGRESS</p>' +
            '<h2 class="reveal" style="--i:1">Three apps live, two in the workshop</h2></div>' +
            '<a class="btn" href="#/work">ALL PROJECTS' + ICON.arrow + "</a></div>" +
          '<div class="grid">' + D.projects.slice(0, 3).map(card).join("") + "</div>" +
          '<div class="rows" style="margin-top:var(--s-12)">' +
            D.projects.slice(3).map(function (p, i) {
              return row({ idx: p.idx, title: p.title, desc: p.desc, when: p.meta, muted: p.muted }, i, p.href);
            }).join("") + "</div>" +
        "</div></section>" +
        '<section class="habits sec">' +
        '<div class="pat-host pattern-rule"></div>' +
        '<div class="wrap">' +
          '<p class="label reveal">HOW I WORK  ·  THREE HABITS</p>' +
          '<h2 class="reveal" style="--i:1">Retrieval and traces decide whether an agent is any good</h2>' +
          '<div class="habits__grid" style="margin-top:var(--s-12)">' + D.habits.map(function (h, i) {
            return '<div class="habit reveal" style="--i:' + i + '">' +
              '<span class="habit__k">' + esc(h.key) + "</span>" +
              '<h3 class="habit__t">' + esc(h.title) + "</h3>" +
              "<p>" + esc(h.body) + "</p></div>"; }).join("") + "</div>" +
        "</div></section>" + ctaBlock();
    },

    work: function () {
      return '<section class="sec" style="padding-bottom:var(--s-12)">' +
        '<div class="pat-host pattern-rule"></div><div class="wrap">' +
        '<p class="label reveal">INDEX  ·  WORK  ·  003 LIVE  ·  002 IN PROGRESS  ·  001 TODO</p>' +
        '<h1 class="reveal" style="--i:1;max-width:18ch"><span class="line">Three apps live, two in the workshop</span></h1>' +
        '<div class="filters reveal" style="--i:2">' +
          ["all", "ai", "mobile", "web", "hardware"].map(function (f, i) {
            return '<button class="tag" data-filter="' + f + '" aria-pressed="' + (i === 0) + '">' + f.toUpperCase() + "</button>"; }).join("") +
        "</div></div></section>" +
        '<section style="padding-bottom:var(--s-24)"><div class="wrap"><div class="grid" id="work-grid">' +
        D.projects.map(card).join("") + "</div></div></section>" + ctaBlock();
    },

    about: function () {
      return '<section class="sec band--soft"><div class="wrap"><div class="hero__grid">' +
        "<div>" +
          '<p class="label reveal">ABOUT  ·  ' + esc(D.identity.name.toUpperCase()) + "  ·  AI & FULL-STACK</p>" +
          '<h1 class="reveal" style="--i:1;max-width:14ch"><span class="line">I like problems that stay solved.</span></h1>' +
          D.about.map(function (p, i) {
            return '<p class="reveal" style="--i:' + (i + 2) + ';margin-top:var(--s-6);font-size:var(--fs-18);color:var(--ink-700)">' + esc(p) + "</p>"; }).join("") +
          '<div class="hero__actions reveal" style="--i:4">' +
            '<a class="btn btn--primary" href="#/#contact">GET IN TOUCH' + ICON.arrow + "</a>" +
            '<a class="btn" href="' + socialHref("GitHub") + '" target="_blank" rel="noopener noreferrer">GITHUB</a>' +
          "</div>" +
        "</div>" +
        '<div class="plate plate--about reveal" style="--i:2">' +
          P.halftoneImage("assets/img/portrait.jpg",
            { pitch: 6, maxDot: 6.4, gamma: 1.15, zoom: 1.4, focusX: 0.74, focusY: 0.15 },
            "Sanjiv Kumar Pandit, rendered as a print halftone") +
          '<span class="plate__cross plate__cross--h" style="top:8%"></span>' +
          '<span class="plate__cross plate__cross--h" style="top:88%"></span>' +
          '<span class="plate__label plate__label--tl">PLATE 01 — SELF PORTRAIT, HALFTONED</span>' +
          '<span class="plate__label plate__label--bl">OPEN TO AI / FULL-STACK ROLES</span>' +
        "</div></div></div></section>" +
        '<section class="sec"><div class="wrap">' +
          '<p class="label reveal">EMPLOYMENT HISTORY  ·  2019 — NOW</p>' +
          '<div class="rows" style="margin-top:var(--s-8)">' +
            D.history.map(function (h, i) { return row(h, i, null); }).join("") + "</div>" +
        "</div></section>" +
        '<section class="sec habits"><div class="wrap"><div class="tool">' +
          "<div>" +
            '<p class="label reveal">TOOLBOX</p>' +
            '<h2 class="reveal" style="--i:1">Deep where it counts</h2>' +
            '<p class="reveal" style="--i:2;color:var(--ink-500);margin-top:var(--s-3)">I would rather understand attention and embeddings properly than collect forty tools by reputation.</p>' +
          "</div><div>" +
            D.toolbox.map(function (g, i) {
              return '<div class="tool__group reveal" style="--i:' + i + '">' +
                '<span class="meta">' + esc(g.group) + "</span>" +
                '<div class="tool__tags">' + g.items.map(function (t) {
                  return '<span class="tag">' + esc(t) + "</span>"; }).join("") + "</div></div>"; }).join("") +
          "</div></div></div></section>" + ctaBlock();
    }
  };

  /* ---------- social ---------- */

  function socialHref(label) {
    for (var i = 0; i < D.social.length; i++)
      if (D.social[i].label === label) return D.social[i].href || "";
    return "";
  }

  function renderSocial() {
    var host = document.getElementById("elsewhere");
    if (!host) return;
    var out = "", i, s;
    for (i = 0; i < D.social.length; i++) {
      s = D.social[i];
      if (!s.href) continue;                       // unset: do not ship a dead link
      var external = s.href.indexOf("mailto:") !== 0;
      out += '<a href="' + esc(s.href) + '"' +
        (external ? ' target="_blank" rel="noopener noreferrer"' : '') + '>' +
        esc(s.label) + "</a>";
    }
    host.innerHTML = out;
  }

  /* ---------- enhancers ---------- */

  var io = "IntersectionObserver" in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add("in");
      if (e.target.dataset && e.target.dataset.count) countUp(e.target);
      io.unobserve(e.target);
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: .06 }) : null;

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  /* Only hide content for reveal once we know we can reveal it again. */
  if (io) document.documentElement.classList.add("js");

  function countUp(el) {
    var target = +el.dataset.count, t0 = null, dur = 900;
    if (reduced) { el.textContent = target; return; }
    function step(ts) {
      if (t0 === null) t0 = ts;
      var p = Math.min(1, (ts - t0) / dur);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function enhance(root) {
    var nodes = root.querySelectorAll(".reveal, [data-count]");
    if (!io) { [].forEach.call(nodes, function (n) { n.classList.add("in"); if (n.dataset.count) n.textContent = n.dataset.count; }); return; }
    [].forEach.call(nodes, function (n) { io.observe(n); });
  }

  /* progress bar fallback where scroll-driven CSS is unsupported */
  var scrollTL = !!(window.CSS && window.CSS.supports &&
    window.CSS.supports("animation-timeline: scroll()"));
  if (!scrollTL) {
    var bar = null, ticking = false;
    addEventListener("scroll", function () {
      if (ticking) return; ticking = true;
      requestAnimationFrame(function () {
        bar = bar || document.querySelector(".progress");
        var h = document.documentElement.scrollHeight - innerHeight;
        if (bar) bar.style.transform = "scaleX(" + (h > 0 ? scrollY / h : 0) + ")";
        ticking = false;
      });
    }, { passive: true });
  }

  /* ---------- theme ---------- */

  var root = document.documentElement;
  function setTheme(mode, persist) {
    if (mode === "system") { root.removeAttribute("data-theme"); localStorage.removeItem("theme"); }
    else { root.setAttribute("data-theme", mode); if (persist) localStorage.setItem("theme", mode); }
    var dark = root.getAttribute("data-theme") === "dark" ||
      (!root.hasAttribute("data-theme") && matchMedia("(prefers-color-scheme: dark)").matches);
    if (window.PAT) requestAnimationFrame(function () { PAT.paint(document); });
    var btn = document.getElementById("theme");
    if (btn) { btn.innerHTML = dark ? ICON.sun : ICON.moon;
      btn.setAttribute("aria-label", dark ? "Switch to light" : "Switch to dark"); }
  }

  /* ---------- router ---------- */

  var routes = { "": "home", "/": "home", "/work": "work", "/about": "about" };

  function render() {
    var hash = location.hash.replace(/^#/, "").split("#")[0];
    var name = routes[hash] || "home";
    var main = document.getElementById("view");
    var paint = function () {
      main.innerHTML = views[name]();
      P.paint(main);
      enhance(main);
      [].forEach.call(document.querySelectorAll(".nav__link"), function (a) {
        var href = a.getAttribute("href") || "";
        if (href.charAt(0) !== "#") return;                 // external link, never "current"
        if (routes[href.slice(1)] === name) a.setAttribute("aria-current", "page");
        else a.removeAttribute("aria-current");
      });
      document.title = (name === "home" ? "" : name[0].toUpperCase() + name.slice(1) + " — ") +
        D.identity.name + " · " + D.identity.role;
      document.querySelector(".menu").classList.remove("open");
      var bg = document.getElementById("burger");
      if (bg) bg.setAttribute("aria-expanded", "false");
      if (!location.hash.split("#")[2]) scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
      bindWork();
    };
    if (document.startViewTransition && !reduced) document.startViewTransition(paint);
    else paint();
  }

  function bindWork() {
    var wrap = document.querySelector(".filters");
    if (!wrap) return;
    wrap.addEventListener("click", function (e) {
      var b = e.target.closest("[data-filter]"); if (!b) return;
      var f = b.dataset.filter;
      [].forEach.call(wrap.children, function (x) { x.setAttribute("aria-pressed", x === b); });
      [].forEach.call(document.querySelectorAll("#work-grid > *"), function (el, i) {
        var p = D.projects[i];
        var show = f === "all" || (p.filters || []).indexOf(f) > -1;
        el.hidden = !show;
      });
    });
  }

  /* ---------- boot ---------- */

  document.addEventListener("DOMContentLoaded", function () {
    setTheme(localStorage.getItem("theme") || "system", false);
    document.getElementById("theme").addEventListener("click", function () {
      var dark = root.getAttribute("data-theme") === "dark" ||
        (!root.hasAttribute("data-theme") && matchMedia("(prefers-color-scheme: dark)").matches);
      setTheme(dark ? "light" : "dark", true);
    });
    var burger = document.getElementById("burger"), menu = document.querySelector(".menu");
    burger.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("open")) {
        menu.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
        burger.focus();
      }
    });
    matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function () {
      if (!localStorage.getItem("theme")) setTheme("system", false);
    });
    var rt; addEventListener("resize", function () {
      clearTimeout(rt); rt = setTimeout(function () { PAT.paint(document); }, 180);
    }, { passive: true });
    renderSocial();
    addEventListener("hashchange", render);
    render();
  });
})();

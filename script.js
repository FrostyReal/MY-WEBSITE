/* =====================================================================
   THINGS YOU CAN EDIT (no coding needed, just change the text in quotes)
   ===================================================================== */

/* Clips: your most-watched YouTube Shorts, biggest first.
   To add one, copy a new line and paste in the video ID (the 11 characters after "/shorts/"). */
const CLIPS = [
  { id: "4_dj4fKax2U", title: "That's A Bit Awkward" },
  { id: "LzaCHC3gIUU", title: "These Guys Got WAY TOO Cocky" },
  { id: "AiySs9ziWX8", title: "Always Be Polite" },
  { id: "61Q9M4-KfKY", title: "Fake \"AI Guide\" Has Returned" },
  { id: "Nu2PHxvqW6w", title: "They Grow Up So FAST" }
];

/* ===================================================================== */

/* Players: play on the page when the site is online. When the page is opened straight
   from a folder on a computer, YouTube and Kick refuse to play, so show a button instead. */
(function players() {
  const openedFromFile = location.protocol === "file:";

  function build(el, embed, open, thumb, title) {
    if (!openedFromFile && embed) {
      const f = document.createElement("iframe");
      f.src = embed;
      f.title = title || "Video player";
      f.loading = "lazy";
      f.allow = "encrypted-media; picture-in-picture; fullscreen";
      f.allowFullscreen = true;
      el.appendChild(f);
      return;
    }
    const a = document.createElement("a");
    a.className = "embed-fallback";
    a.href = open || embed;
    a.target = "_blank";
    a.rel = "noopener";
    if (thumb) a.style.backgroundImage = "url('" + thumb + "')";
    a.innerHTML = '<span class="embed-play" aria-hidden="true"></span><span class="embed-label">' + (title || "Watch") + "</span>";
    el.appendChild(a);
  }

  document.querySelectorAll(".embed").forEach(function (el) {
    build(el, el.dataset.embed, el.dataset.open, el.dataset.thumb, el.dataset.title);
  });

  const grid = document.getElementById("clip-grid");
  if (grid) {
    CLIPS.forEach(function (c) {
      const card = document.createElement("div");
      card.className = "clip-card";
      const box = document.createElement("div");
      box.className = "clip";
      build(box, "https://www.youtube-nocookie.com/embed/" + c.id, "https://www.youtube.com/shorts/" + c.id, "https://i.ytimg.com/vi/" + c.id + "/hqdefault.jpg", c.title);
      const t = document.createElement("p");
      t.textContent = c.title;
      card.appendChild(box);
      card.appendChild(t);
      grid.appendChild(card);
    });
  }
})();

/* ---------- Falling snow ---------- */
(function snow() {
  const canvas = document.getElementById("snow");
  if (!canvas) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { canvas.style.display = "none"; return; }

  const ctx = canvas.getContext("2d");
  let w, h, flakes = [], boost = 0, lastY = window.scrollY;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.round(Math.min(130, Math.max(45, (w * h) / 14000)));
    flakes = Array.from({ length: count }, function () { return makeFlake(true); });
  }

  function makeFlake(anywhere) {
    const depth = Math.random();            // 0 = far, 1 = near
    return {
      x: Math.random() * w,
      y: anywhere ? Math.random() * h : -10,
      r: 0.8 + depth * 2.6,
      speed: 0.35 + depth * 1.1,
      sway: Math.random() * Math.PI * 2,
      swaySpeed: 0.004 + Math.random() * 0.01,
      alpha: 0.35 + depth * 0.55
    };
  }

  window.addEventListener("scroll", function () {
    boost = Math.min(6, boost + Math.abs(window.scrollY - lastY) * 0.05);
    lastY = window.scrollY;
  }, { passive: true });

  function frame() {
    ctx.clearRect(0, 0, w, h);
    boost *= 0.94;
    for (const f of flakes) {
      f.sway += f.swaySpeed;
      f.y += f.speed + boost * f.speed * 0.6;
      f.x += Math.sin(f.sway) * 0.4;
      if (f.y > h + 10) Object.assign(f, makeFlake(false));
      if (f.x < -10) f.x = w + 10; else if (f.x > w + 10) f.x = -10;
      ctx.beginPath();
      ctx.fillStyle = "rgba(255,255,255," + f.alpha + ")";
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(frame);
  }

  window.addEventListener("resize", resize);
  resize();
  frame();
})();

/* ---------- About: scroll-in reveal ---------- */
(function reveal() {
  const els = document.querySelectorAll(".reveal");
  if (!els.length) return;
  if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    els.forEach(function (e) { e.classList.add("in"); });
    return;
  }
  const io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { threshold: 0.2 });
  els.forEach(function (e) { io.observe(e); });
})();

/* ---------- Schedule: highlight today + countdown to next stream (Eastern time) ---------- */
(function schedule() {
  const out = document.getElementById("next-stream");
  if (!out) return;
  const DAYS = [1, 3, 5], HOUR = 17;
  function etNow() {
    const p = new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", weekday: "short", hour: "numeric", minute: "numeric", second: "numeric", hour12: false }).formatToParts(new Date());
    const g = function (t) { return p.find(function (x) { return x.type === t; }).value; };
    const wd = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[g("weekday")];
    return { wd: wd, secs: (parseInt(g("hour"), 10) % 24) * 3600 + parseInt(g("minute"), 10) * 60 + parseInt(g("second"), 10) };
  }
  function tick() {
    const n = etNow();
    document.querySelectorAll(".schedule-days li").forEach(function (li) {
      li.classList.toggle("today", Number(li.dataset.day) === n.wd);
    });
    let best = null;
    for (let add = 0; add <= 7; add++) {
      const d = (n.wd + add) % 7;
      if (DAYS.indexOf(d) === -1) continue;
      const diff = add * 86400 + HOUR * 3600 - n.secs;
      if (diff > 0 && (best === null || diff < best)) best = diff;
    }
    if (best === null) { out.textContent = ""; return; }
    const dd = Math.floor(best / 86400), hh = Math.floor(best % 86400 / 3600), mm = Math.floor(best % 3600 / 60);
    out.innerHTML = "Next stream in <strong>" + (dd ? dd + "d " : "") + hh + "h " + mm + "m</strong>";
  }
  tick();
  setInterval(tick, 30000);
})();

/* ---------- Kick: show the live player when live, otherwise a clean latest-stream card ---------- */
(function kick() {
  const box = document.getElementById("kick-box");
  if (!box || location.protocol === "file:") return;
  const NAME = "frostyreal";
  function get(path) {
    return fetch("https://kick.com/api/v2/channels/" + NAME + path, { headers: { Accept: "application/json" } })
      .then(function (r) { if (!r.ok) throw new Error("bad"); return r.json(); });
  }
  function esc(t) { const d = document.createElement("div"); d.textContent = t; return d.innerHTML; }
  get("").then(function (ch) {
    if (ch && ch.livestream) return; // live: keep the live player
    return get("/videos").then(function (vids) {
      const v = vids && vids[0];
      if (!v) return;
      const title = (v.session_title || (v.livestream && v.livestream.session_title) || "Latest stream");
      let when = "";
      const raw = v.created_at || (v.livestream && v.livestream.created_at) || v.start_time;
      if (raw) { const dt = new Date(String(raw).replace(" ", "T") + (/[zZ]|[+-]\d\d:?\d\d$/.test(String(raw)) ? "" : "Z")); if (!isNaN(dt)) when = dt.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" }); }
      const uuid = v.video && v.video.uuid;
      const link = uuid ? "https://kick.com/frostyreal/videos/" + uuid : "https://kick.com/frostyreal/videos";
      box.innerHTML = '<div class="kick-card"><div class="kick-art"><img src="images/logo-white.png" alt="" width="200" height="188"></div>' +
        '<div class="kick-info"><span class="kick-badge">Offline right now</span><p>Latest stream</p><h3>' + esc(title) + "</h3>" +
        (when ? "<p>" + esc(when) + "</p>" : "") +
        '<div class="hero-actions"><a class="btn" href="' + link + '" target="_blank" rel="noopener">Watch this stream</a>' +
        '<a class="btn btn-ghost" href="https://kick.com/frostyreal" target="_blank" rel="noopener">Follow on Kick</a></div></div></div>';
    });
  }).catch(function () { /* keep the live player */ });
})();

/* ---------- Numbers count up when they scroll into view ---------- */
(function countUp() {
  const els = document.querySelectorAll(".kit-stats dd, .mk-circles strong, .mk-audience dd strong, .mk-total strong");
  if (!els.length || !("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  function run(el) {
    const m = /^(\d+(?:\.\d+)?)(.*)$/.exec(el.textContent.trim());
    if (!m) return;
    const end = parseFloat(m[1]), dec = (m[1].split(".")[1] || "").length, rest = m[2], dur = 2100, t0 = performance.now();
    el.setAttribute("aria-label", el.textContent.trim());
    function step(now) {
      const p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 2);
      el.textContent = (end * e).toFixed(dec) + rest;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  const io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { if (en.isIntersecting) { run(en.target); io.unobserve(en.target); } });
  }, { threshold: 0.6 });
  els.forEach(function (e) { io.observe(e); });
})();

/* ---------- Cards tilt toward the mouse (mouse devices only) ---------- */
(function tilt() {
  if (!window.matchMedia("(hover: hover)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  document.querySelectorAll(".sponsor, .work-with-me, .kit-stats div, .mk-audience div, .mk-circles li, .kick-card").forEach(function (c) {
    c.classList.add("tilt");
    c.addEventListener("pointermove", function (e) {
      const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      c.style.setProperty("--ry", (x * 8).toFixed(2) + "deg");
      c.style.setProperty("--rx", (-y * 8).toFixed(2) + "deg");
      c.classList.add("is-tilting");
    });
    c.addEventListener("pointerleave", function () {
      c.style.setProperty("--ry", "0deg"); c.style.setProperty("--rx", "0deg"); c.classList.remove("is-tilting");
    });
  });
})();

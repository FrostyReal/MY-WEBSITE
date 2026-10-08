/* Night sea hero scene: stars, moon glitter and seagulls. The shapes themselves are in index.html. */

const SEA_REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)");

/* Stars: small dots in the upper sky, a few twinkle slowly */
(function stars() {
  const box = document.getElementById("sea-stars");
  if (!box) return;
  const count = window.innerWidth < 760 ? 60 : 120;
  const frag = document.createDocumentFragment();
  let made = 0, guard = 0;
  while (made < count && guard++ < 2000) {
    const x = Math.random() * 100;
    const y = Math.pow(Math.random(), 1.25) * 88;   // more stars up high, fewer toward the horizon
    // keep most stars away from the moon (about 78% across, 20% down)
    const nearMoon = Math.abs(x - 78) < 9 && Math.abs(y - 33) < 20;
    if (nearMoon && Math.random() < 0.8) continue;
    const s = document.createElement("i");
    const size = Math.random() < 0.12 ? 2.4 : (Math.random() < 0.5 ? 1.6 : 1);
    s.className = "star";
    s.style.left = x.toFixed(2) + "%";
    s.style.top = y.toFixed(2) + "%";
    s.style.width = s.style.height = size + "px";
    s.style.setProperty("--o", (0.25 + Math.random() * 0.6).toFixed(2));
    if (Math.random() < 0.15) {
      s.classList.add("is-twinkle");
      s.style.setProperty("--d", (4 + Math.random() * 5).toFixed(1) + "s");
      s.style.setProperty("--dl", (-Math.random() * 8).toFixed(1) + "s");
    }
    frag.appendChild(s);
    made++;
  }
  box.appendChild(frag);
})();

/* Moon glitter: short bright streaks under the moon, wider the closer to the viewer */
(function glitter() {
  const box = document.getElementById("sea-glitter");
  if (!box) return;
  const count = window.innerWidth < 760 ? 34 : 56;
  const frag = document.createDocumentFragment();
  for (let i = 0; i < count; i++) {
    const depth = Math.pow(i / (count - 1), 0.85);          // 0 at the horizon, 1 at the front
    const top = 1 + depth * 92;                              // % down the column
    const width = 7 + depth * 78 + Math.random() * 12;       // % of column width
    const jitter = (Math.random() - 0.5) * (6 + depth * 26);
    const s = document.createElement("i");
    s.className = "streak";
    s.style.top = top.toFixed(2) + "%";
    s.style.width = width.toFixed(1) + "%";
    s.style.left = (50 - width / 2 + jitter).toFixed(1) + "%";
    s.style.height = (1.5 + depth * 2).toFixed(1) + "px";
    s.style.setProperty("--o", (0.35 + Math.random() * 0.55).toFixed(2));
    s.style.setProperty("--d", (2 + Math.random() * 3.5).toFixed(1) + "s");
    s.style.setProperty("--dl", (-Math.random() * 6).toFixed(1) + "s");
    frag.appendChild(s);
  }
  box.appendChild(frag);
})();

/* Seagulls: now and then a small flock crosses the sky, then disappears */
(function gulls() {
  const layer = document.getElementById("sea-gulls");
  if (!layer || !layer.animate) return;
  const MAX_FLOCKS = 2;
  let alive = 0, timer = 0, heroInView = true;

  const GULL = '<svg viewBox="0 0 30 14" focusable="false">' +
    '<path class="gull__w gull__l" d="M15 8 C12 3 6 2 0 5 C6 5 11 6 15 9 Z"/>' +
    '<path class="gull__w gull__r" d="M15 8 C18 3 24 2 30 5 C24 5 19 6 15 9 Z"/>' +
    '<ellipse class="gull__b" cx="15" cy="8.6" rx="2" ry="1.3"/></svg>';

  function rand(a, b) { return a + Math.random() * (b - a); }

  function spawn() {
    const w = layer.clientWidth, h = layer.clientHeight;
    if (!w || !h) return;
    const toRight = Math.random() < 0.5;
    const flock = document.createElement("div");
    flock.className = "gull-flock";
    flock.style.top = (rand(10, 45) / 100 * h).toFixed(0) + "px";
    const n = 1 + Math.floor(Math.random() * 3);
    for (let i = 0; i < n; i++) {
      const g = document.createElement("div");
      const size = rand(18, 28);
      g.className = "gull";
      g.style.width = size.toFixed(0) + "px";
      g.style.left = (i * rand(26, 44) * (toRight ? -1 : 1)).toFixed(0) + "px";   // trailing behind the leader
      g.style.top = (i * rand(-14, 14) + (i ? rand(-6, 10) : 0)).toFixed(0) + "px";
      g.style.opacity = (0.5 + (size - 18) / 10 * 0.25).toFixed(2);   // smaller = further = fainter
      g.style.setProperty("--bd", rand(4, 7).toFixed(1) + "s");
      g.style.setProperty("--bl", (-rand(0, 5)).toFixed(1) + "s");
      g.style.setProperty("--fl", (-rand(0, 3)).toFixed(1) + "s");
      g.innerHTML = GULL;
      if (!toRight) g.firstChild.style.transform = "scaleX(-1)";
      flock.appendChild(g);
    }
    layer.appendChild(flock);
    alive++;
    const from = toRight ? -140 : w + 40;
    const to = toRight ? w + 40 : -140;
    const run = flock.animate(
      [{ transform: "translate3d(" + from + "px,0,0)" }, { transform: "translate3d(" + to + "px,0,0)" }],
      { duration: rand(14, 22) * 1000, easing: "linear", fill: "forwards" }
    );
    run.onfinish = function () { flock.remove(); alive--; };
  }

  function schedule(delay) {
    clearTimeout(timer);
    if (SEA_REDUCED.matches || document.hidden) return;
    timer = setTimeout(function () {
      if (heroInView && alive < MAX_FLOCKS && !document.hidden && !SEA_REDUCED.matches) spawn();
      schedule(rand(9, 22) * 1000);
    }, delay);
  }

  function restart() { schedule(4000); }
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) clearTimeout(timer); else restart();
  });
  if (SEA_REDUCED.addEventListener) SEA_REDUCED.addEventListener("change", function () {
    if (SEA_REDUCED.matches) { clearTimeout(timer); layer.textContent = ""; alive = 0; } else restart();
  });
  const hero = document.querySelector(".hero");
  if (hero && "IntersectionObserver" in window) {
    new IntersectionObserver(function (e) { heroInView = e[0].isIntersecting; }).observe(hero);
  }
  restart();
})();

/* Waves: redraw each wave band as a taller, uneven rolling swell with a moonlit sheen.
   The shape repeats every half of the track, so the endless scroll has no visible seam. */
(function waves() {
  const bands = document.querySelectorAll(".scene .wave");
  if (!bands.length) return;
  const NS = "http://www.w3.org/2000/svg";
  const HEIGHTS = [20, 30, 44, 62, 86];      // far to near: closer waves are bigger
  const CYCLES = [[4, 7], [3, 6], [3, 5], [2, 4], [2, 3]]; // swell + chop, per half track (calm sea: fewer, longer swells)

  bands.forEach(function (band, i) {
    const svg = band.querySelector("svg");
    if (!svg) return;
    const H = HEIGHTS[i] || 40, c = CYCLES[i] || [5, 8], W = 1200, half = 600;
    const amp = H * 0.16, base = H * 0.55;
    let top = "";
    for (let x = 0; x <= W; x += 4) {
      const a = (x % half) / half * Math.PI * 2;
      const y = base - amp * (0.85 * Math.sin(a * c[0]) + 0.15 * Math.sin(a * c[1] + 1.3));
      top += (x ? " L" : "M") + x + " " + y.toFixed(1);
    }
    svg.setAttribute("viewBox", "0 0 " + W + " " + H);
    band.style.setProperty("--h", H + "px");
    const id = "wsheen" + i;
    svg.innerHTML =
      '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="#bfe6ff" stop-opacity="' + (0.16 - i * 0.02).toFixed(2) + '"/>' +
      '<stop offset=".7" stop-color="#bfe6ff" stop-opacity="0"/></linearGradient></defs>' +
      '<path d="' + top + ' V' + H + ' H0 Z"/>' +
      '<path d="' + top + ' V' + H + ' H0 Z" fill="url(#' + id + ')" style="fill:url(#' + id + ')"/>' +
      '<path class="crest" d="' + top + '"/>';
  });
})();

/* Ship: emerges small on the horizon between the two islands, sails toward you along a gentle curve
   (growing as it gets closer), fades out near the front, waits a few seconds, then does it again.
   It sits in the water layer in the markup, so it passes in front of the far island and far waves
   but behind the near island and the nearest waves. */
(function ship() {
  const el = document.getElementById("sea-ship");
  const scene = document.querySelector(".scene");
  const water = scene && scene.querySelector(".scene__water");
  if (!el || !scene || !water) return;
  const rock = el.querySelector(".ship__rock");
  const PASS = 52;                 // seconds for one trip toward the viewer
  const WAIT_MIN = 6, WAIT_MAX = 12;   // seconds of calm sea before the next one
  const SCALE_START = 0.25;
  let W = 0, SH = 0, WT = 0, phone = false;
  let t = 0, wait = 0, sailing = true, clock = 0, last = 0, raf = 0, inView = true;

  function measure() {
    W = scene.clientWidth;
    SH = scene.clientHeight;
    WT = SH - water.clientHeight;   // where the horizon is, from the top of the hero
    phone = W < 760;
  }

  function bez(a, b, c, d, s) {
    const u = 1 - s;
    return u * u * u * a + 3 * u * u * s * b + 3 * u * s * s * c + s * s * s * d;
  }

  // p = 0..1 along the trip. Returns the hull's waterline position (px in the water layer), scale and opacity.
  function pose(p) {
    const x0 = W * (phone ? 0.62 : 0.34);   // open water between the near island and the far island (far island sits about 42% to 64% on desktop)
    const x3 = W * (phone ? 0.74 : 0.70);   // lower right of the hero, away from the near island
    const y0 = 3;
    const y3 = SH * 0.85 - WT;              // about 85% down the hero
    const s = 0.65 * p + 0.35 * (1 - (1 - p) * (1 - p));   // eases so it slows a little near the front
    const x = bez(x0, x0 + (x3 - x0) * 0.05, x0 + (x3 - x0) * 0.55, x3, s);
    const y = bez(y0, y3 * 0.3, y3 * 0.7, y3, s);
    const sc = SCALE_START + ((phone ? 1.2 : 2.0) - SCALE_START) * Math.pow(s, 1.15);
    let op = 1;
    if (p < 0.05) op = 0.35 + 0.65 * (p / 0.05);
    else if (p > 0.92) op = Math.max(0, (1 - p) / 0.08);
    return { x: x, y: y, sc: sc, op: op };
  }

  function apply(pz, rockOn) {
    el.style.transform = "translate3d(" + pz.x.toFixed(1) + "px," + pz.y.toFixed(1) + "px,0) scale(" + pz.sc.toFixed(3) + ") translate(-50%,-100%)";
    el.style.opacity = pz.op.toFixed(3);
    el.style.setProperty("--wake", (Math.max(0, Math.min(1, (pz.sc - 0.6) / 1.2)) * 0.5).toFixed(2));
    if (rock) {
      const a = rockOn ? Math.sin(clock * 2 * Math.PI / 5.5) : 0;
      const b = rockOn ? Math.sin(clock * 2 * Math.PI / 3.7 + 1) : 0;
      rock.style.transform = "translateY(" + (b * 2.5).toFixed(2) + "px) rotate(" + (a * 2.5).toFixed(2) + "deg)";
    }
  }

  function showStill() {   // reduced motion: parked partway between the islands
    measure();
    apply(pose(0.2), false);
  }

  function frame(now) {
    const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
    last = now;
    clock += dt;
    if (sailing) {
      t += dt;
      if (t >= PASS) { sailing = false; wait = WAIT_MIN + Math.random() * (WAIT_MAX - WAIT_MIN); el.style.opacity = "0"; }
      else apply(pose(t / PASS), true);
    } else {
      wait -= dt;
      if (wait <= 0) { sailing = true; t = 0; }
    }
    raf = requestAnimationFrame(frame);
  }

  function start() {
    cancelAnimationFrame(raf);
    last = 0;
    if (SEA_REDUCED.matches) { showStill(); return; }
    if (document.hidden || !inView) return;
    raf = requestAnimationFrame(frame);
  }

  window.addEventListener("resize", function () {
    measure();
    if (SEA_REDUCED.matches) showStill(); else if (sailing) apply(pose(t / PASS), true);
  });
  document.addEventListener("visibilitychange", start);
  if (SEA_REDUCED.addEventListener) SEA_REDUCED.addEventListener("change", start);
  const hero = document.querySelector(".hero");
  if (hero && "IntersectionObserver" in window) {
    new IntersectionObserver(function (e) { inView = e[0].isIntersecting; start(); }).observe(hero);
  }
  measure();
  t = 3;   // already a little way out when the page opens
  start();
})();

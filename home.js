/* ===================================================================== */
/* THINGS YOU CAN EDIT (no coding needed, just change the text in quotes)

   FEATURED and LONG_VIDEOS below control the "Watch the chaos" section.
   To change a video, paste the 11-character ID from its web address.      */

/* The featured video (big one in "Watch the chaos") */
const FEATURED = { id: "e-QJw6BJbkQ", title: "How I Hit PIRATE LEGEND In 2026", line: "Fresh off the boat." };

/* LONG_VIDEOS: the "More videos" tiles. Only the first 4 are shown, so put the ones you want on top. To add one, copy a line and paste the
   11-character ID that comes after v= in the video's web address.
   Example: youtube.com/watch?v=NNKyi9a35sY  ->  id: "NNKyi9a35sY"
   Then type the title you want people to see. */
const LONG_VIDEOS = [
  { id: "NNKyi9a35sY", title: "How a 3700 SOLO Player Goes from POOR to RICH" },
  { id: "HG5UmndyztY", title: "How a 3600 Hour SOLO player FARMS GOLD from SCRATCH" },
  { id: "TRUDuoTgEMI", title: "Pretending To Be A NOOB... And They Believed Me" },
  { id: "NWyEOsBG5Es", title: "How A 3500 Hour SOLO Player Would Restart Sea Of Thieves" },
  { id: "kzwwMlRRg44", title: "Sea of Thieves' Most Underrated Playstyle" }
];

/* MERCH_SHOWCASE: the 3 products that flip by in the "Merch Is Here" band.
   slug  = the end of the product's link on the shop (the last part of the product's web address)
   name  = what shows under the picture
   image = which photo of that product to show (0 is the first photo, 1 is the second, and so on)
   To change one, swap the slug, name and image number. The pictures load live from the shop. */
const MERCH_SHOWCASE = [
  { slug: "frosty-t-shirt-white-print", name: "Frosty Wavy Tee", image: 1 },
  { slug: "frosty-drip-cropped-hoodie", name: "Frosty Drip Cropped Hoodie", image: 0 },
  { slug: "frosty-hat-black", name: "Frosty Hat", image: 0 }
];

/* GOATCOUNTER: private visitor stats (only you see them, no cookies, no banner needed).
   Make a free account at goatcounter.com, then type your code between the quotes.
   Example: "frostyreal" if your dashboard is frostyreal.goatcounter.com. Leave "" to keep stats off. */
const GOATCOUNTER = "frostyreal";   // your GoatCounter code, e.g. "frostyreal" from frostyreal.goatcounter.com. Leave "" to keep stats off.

/* KICK_CHECK_MINUTES: how often (in minutes) the site asks Kick "is Frosty live?" while the page is open.
   The LIVE badge in the header and the "Live now" labels use the answer. */
const KICK_CHECK_MINUTES = 2;
/* ===================================================================== */

const OPENED_FROM_FILE = location.protocol === "file:";

/* Visitor stats: loads GoatCounter only when a code is set above */
(function stats() {
  if (!GOATCOUNTER || OPENED_FROM_FILE) return;
  if (document.querySelector("script[data-goatcounter]")) return;
  const sc = document.createElement("script");
  sc.setAttribute("data-goatcounter", "https://" + encodeURIComponent(GOATCOUNTER) + ".goatcounter.com/count");
  sc.async = true;
  sc.src = "https://gc.zgo.at/count.js";
  document.head.appendChild(sc);
})();

/* Snow: light falling flakes behind everything */
(function snow() {
  const canvas = document.getElementById("snow");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  let w = 0, h = 0, flakes = [], raf = 0, t = 0;

  function make() {
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      r: 0.6 + Math.random() * 1.6,
      a: 0.35 + Math.random() * 0.45,
      v: 0.25 + Math.random() * 0.6,
      ph: Math.random() * Math.PI * 2,
      dr: 0.2 + Math.random() * 0.5
    };
  }

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const want = w < 760 ? 35 : 70;
    while (flakes.length < want) flakes.push(make());
    flakes.length = want;
    flakes.forEach(function (f) { if (f.x > w) f.x = Math.random() * w; if (f.y > h) f.y = Math.random() * h; });
    draw();
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    flakes.forEach(function (f) {
      ctx.beginPath();
      ctx.fillStyle = "rgba(255,255,255," + f.a + ")";
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function step() {
    t += 0.01;
    flakes.forEach(function (f) {
      f.y += f.v;
      f.x += Math.sin(t + f.ph) * f.dr;
      if (f.y > h + 4) { f.y = -4; f.x = Math.random() * w; }
      if (f.x > w + 4) f.x = -4;
      if (f.x < -4) f.x = w + 4;
    });
    draw();
    raf = requestAnimationFrame(step);
  }

  function start() {
    cancelAnimationFrame(raf);
    if (reduced.matches || document.hidden) return;
    raf = requestAnimationFrame(step);
  }

  window.addEventListener("resize", resize);
  document.addEventListener("visibilitychange", start);
  if (reduced.addEventListener) reduced.addEventListener("change", start);
  resize();
  start();
})();

/* Header: solid background after scrolling, active tab by section in view */
(function header() {
  const bar = document.getElementById("top-bar");
  if (!bar) return;
  function onScroll() { bar.classList.toggle("is-solid", window.scrollY > 40); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const tabs = Array.prototype.slice.call(bar.querySelectorAll("[data-section]"));
  if (!tabs.length) return;
  const targets = [];
  tabs.forEach(function (a) {
    const id = a.getAttribute("data-section");
    const el = id === "top" ? document.querySelector(".hero") : document.getElementById(id);
    if (el) targets.push({ id: id, el: el });
  });
  // highlight the section with the most of its area on screen
  function pick() {
    const vh = window.innerHeight;
    let best = null, bestVis = 0;
    targets.forEach(function (t) {
      const r = t.el.getBoundingClientRect();
      const vis = Math.min(r.bottom, vh) - Math.max(r.top, 0);
      if (vis > bestVis) { bestVis = vis; best = t.id; }
    });
    tabs.forEach(function (a) {
      const on = a.getAttribute("data-section") === best;
      a.classList.toggle("is-active", on);
      if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
    });
  }
  window.addEventListener("scroll", pick, { passive: true });
  window.addEventListener("resize", pick);
  pick();
})();

/* Kick live status: one shared check used by the header badge, the hero chip and the Live section.
   status is "live", "offline" or "unknown" (any failure = unknown, badge stays hidden). */
const Kick = (function () {
  const URL = "https://kick.com/api/v2/channels/frostyreal";
  const listeners = [];
  let status = "unknown", timer = null;

  function set(next) {
    if (next === status) return;
    status = next;
    document.documentElement.classList.toggle("kick-live", next === "live");
    listeners.forEach(function (fn) { try { fn(status); } catch (e) {} });
  }

  async function check() {
    if (OPENED_FROM_FILE || typeof fetch !== "function") return;
    const ctl = typeof AbortController === "function" ? new AbortController() : null;
    const t = setTimeout(function () { if (ctl) ctl.abort(); }, 8000);
    try {
      const r = await fetch(URL, { headers: { Accept: "application/json" }, signal: ctl ? ctl.signal : undefined });
      if (!r.ok) throw new Error("bad status");
      const j = await r.json();
      if (!j || typeof j !== "object" || !("livestream" in j)) throw new Error("bad json");
      set(j.livestream && j.livestream.is_live !== false ? "live" : "offline");
    } catch (e) {
      set("unknown");
    } finally {
      clearTimeout(t);
    }
  }

  function start() { stop(); check(); timer = setInterval(check, Math.max(1, KICK_CHECK_MINUTES) * 60000); }
  function stop() { if (timer) { clearInterval(timer); timer = null; } }
  document.addEventListener("visibilitychange", function () { if (document.hidden) stop(); else start(); });
  if (!document.hidden) start();

  return { status: function () { return status; }, onChange: function (fn) { listeners.push(fn); } };
})();

/* Header LIVE badge: only visible while Kick says Frosty is live */
(function liveBadge() {
  const badge = document.getElementById("live-badge");
  if (!badge) return;
  Kick.onChange(function (st) { badge.hidden = st !== "live"; });
})();

/* Schedule: one function used by the hero chip, the day tiles and the countdown */
const Schedule = (function () {
  const DAYS = [1, 3, 5];   // Mon, Wed, Fri
  const HOUR = 17;          // 5 PM Eastern
  const LIVE_HOURS = 3;     // counts as live for 3 hours
  const NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York", weekday: "short", hour: "numeric", minute: "numeric", hour12: false
  });

  function etNow() {
    const p = {};
    fmt.formatToParts(new Date()).forEach(function (x) { p[x.type] = x.value; });
    return { day: NAMES.indexOf(p.weekday), mins: (parseInt(p.hour, 10) % 24) * 60 + parseInt(p.minute, 10) };
  }

  function state() {
    const n = etNow();
    const real = Kick.status();   // Kick's real answer wins over the schedule
    if (real === "live") return { live: true, day: n.day, offset: 0, minsLeft: 0 };
    const start = HOUR * 60;
    const isStreamDay = DAYS.indexOf(n.day) !== -1;
    if (real !== "offline" && isStreamDay && n.mins >= start && n.mins < start + LIVE_HOURS * 60) {
      return { live: true, day: n.day, offset: 0, minsLeft: 0 };
    }
    for (let off = 0; off <= 7; off++) {
      const d = (n.day + off) % 7;
      if (DAYS.indexOf(d) === -1) continue;
      if (off === 0 && n.mins >= start) continue;
      return { live: false, day: d, offset: off, minsLeft: off * 1440 + start - n.mins };
    }
    return { live: false, day: DAYS[0], offset: 7, minsLeft: 0 };
  }

  return { state: state, names: NAMES };
})();

/* Hero status chip */
(function chip() {
  const chipEl = document.querySelector(".chip");
  const text = document.getElementById("chip-text");
  if (!chipEl || !text) return;
  function update() {
    const s = Schedule.state();
    chipEl.classList.toggle("is-live", s.live);
    if (s.live) text.textContent = "Live now on Kick";
    else if (s.offset === 0) text.textContent = "Today 5 PM ET";
    else text.textContent = "Next stream: " + Schedule.names[s.day] + " 5 PM ET";
  }
  update();
  setInterval(update, 30000);
  Kick.onChange(update);
})();

/* Day tiles + countdown */
(function days() {
  const tiles = document.querySelectorAll("#days .day");
  const countdown = document.getElementById("countdown");
  if (!tiles.length) return;
  function update() {
    const s = Schedule.state();
    tiles.forEach(function (tile) {
      const match = parseInt(tile.getAttribute("data-day"), 10) === s.day;
      tile.classList.toggle("is-next", match);
      tile.querySelector(".day__flag").textContent = match ? (s.live ? "Live now" : "Next up") : "";
    });
    if (!countdown) return;
    if (s.live) { countdown.textContent = "Live right now. Come say hi."; return; }
    const d = Math.floor(s.minsLeft / 1440);
    const hr = Math.floor((s.minsLeft % 1440) / 60);
    const m = s.minsLeft % 60;
    countdown.textContent = "Next stream in " + (d ? d + "d " : "") + hr + "h " + m + "m";
  }
  update();
  setInterval(update, 30000);
  Kick.onChange(update);
})();

/* Click-to-load players (YouTube + Kick) */
function makeFacade(box, opts) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "facade" + (opts.small ? " facade--sm" : "");
  btn.setAttribute("aria-label", opts.label);
  if (opts.thumb) {
    const img = document.createElement("img");
    img.src = opts.thumb;
    img.alt = "";
    img.loading = "lazy";
    btn.appendChild(img);
  }
  const play = document.createElement("span");
  play.className = "facade__play";
  play.setAttribute("aria-hidden", "true");
  btn.appendChild(play);
  if (opts.text) {
    const t = document.createElement("span");
    t.className = "facade__label";
    t.textContent = opts.text;
    btn.appendChild(t);
  }
  btn.addEventListener("click", function () {
    if (OPENED_FROM_FILE) { window.open(opts.open, "_blank", "noopener"); return; }
    const frame = document.createElement("iframe");
    frame.src = opts.embed;
    frame.title = opts.title;
    frame.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
    frame.allowFullscreen = true;
    box.replaceChild(frame, btn);
    frame.focus();
    if (opts.onplay) opts.onplay(frame);
  });
  box.appendChild(btn);
}

/* Watch section: featured video + More videos grid (the first 4 of LONG_VIDEOS) */
(function watch() {
  const box = document.getElementById("watch-featured");
  if (!box) return;
  const thumb = function (id, q) { return "https://i.ytimg.com/vi/" + id + "/" + q + ".jpg"; };
  const watchUrl = "https://www.youtube.com/watch?v=" + FEATURED.id;

  makeFacade(box, {
    label: "Play " + FEATURED.title,
    title: FEATURED.title,
    thumb: thumb(FEATURED.id, "maxresdefault"),
    embed: "https://www.youtube-nocookie.com/embed/" + FEATURED.id + "?autoplay=1&playsinline=1",
    open: watchUrl
  });
  document.getElementById("watch-title").textContent = FEATURED.title;
  document.getElementById("watch-line").textContent = FEATURED.line || "";
  document.getElementById("watch-open").href = watchUrl;
  // "Watch it here" does the same thing as clicking the big thumbnail
  document.getElementById("watch-play").addEventListener("click", function () {
    const facade = box.querySelector(".facade");
    if (facade) facade.click(); else box.querySelector("iframe") && box.querySelector("iframe").focus();
  });

  const list = document.getElementById("video-list");
  if (!list) return;
  LONG_VIDEOS.slice(0, 4).forEach(function (v) {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = "https://www.youtube.com/watch?v=" + v.id;
    a.target = "_blank";
    a.rel = "noopener";
    const m = document.createElement("span");
    m.className = "media media--wide";
    const img = document.createElement("img");
    img.loading = "lazy";
    img.src = thumb(v.id, "mqdefault");
    img.alt = "";
    m.appendChild(img);
    const t = document.createElement("span");
    t.className = "video-list__t";
    t.textContent = v.title;
    a.appendChild(m);
    a.appendChild(t);
    li.appendChild(a);
    list.appendChild(li);
  });
})();

/* Kick player */
(function kick() {
  const box = document.getElementById("kick");
  if (!box) return;
  makeFacade(box, {
    label: "Play FrostyReal live on Kick",
    title: "FrostyReal live on Kick",
    text: "Watch FrostyReal live on Kick",
    embed: "https://player.kick.com/frostyreal",
    open: "https://kick.com/frostyreal"
  });
})();

/* Merch band: flips through real products (photos load live from the Fourthwall shop).
   Until they load, or if anything fails, the emote card in the markup stays. */
(function merchShowcase() {
  const box = document.getElementById("merch-showcase");
  const stage = document.getElementById("showcase-stage");
  const nameEl = document.getElementById("showcase-name");
  const dotsEl = document.getElementById("showcase-dots");
  if (!box || !stage || !nameEl || !dotsEl || OPENED_FROM_FILE) return;
  const API = "https://storefront-api.fourthwall.com/v1/collections/all/products?storefront_token=ptkn_f1befabb-7502-4c1a-8482-1ea6ef1f4926&currency=USD&page=";
  const EVERY = 3500;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  let items = [], cards = [], dots = [], cur = 0, timer = 0, paused = false, onScreen = true;

  function lookup() {
    const found = {};
    let want = MERCH_SHOWCASE.length;
    function page(n) {
      if (n > 2 || !want) return Promise.resolve();
      return fetch(API + n).then(function (r) { if (!r.ok) throw new Error("shop"); return r.json(); }).then(function (data) {
        const list = (data && data.results) || [];
        if (!list.length) return;
        list.forEach(function (p) {
          MERCH_SHOWCASE.forEach(function (m) {
            if (m.slug === p.slug && !found[m.slug] && p.images && p.images.length) {
              found[m.slug] = (p.images[m.image] || p.images[0]).url;
              want--;
            }
          });
        });
        return page(n + 1);
      });
    }
    return page(0).then(function () { return found; });
  }

  function preload(url) {
    return new Promise(function (resolve) {
      const im = new Image();
      im.onload = function () { resolve(true); };
      im.onerror = function () { resolve(false); };
      im.src = url;
    });
  }

  function show(i) {
    cur = (i + items.length) % items.length;
    cards.forEach(function (c, k) {
      const d = (k - cur + items.length) % items.length;
      const pos = d === 0 ? "0" : d === 1 ? "1" : d === items.length - 1 ? "prev" : "far";
      c.setAttribute("data-pos", pos);
      if (d === 0) { c.removeAttribute("aria-hidden"); c.removeAttribute("tabindex"); }
      else { c.setAttribute("aria-hidden", "true"); c.setAttribute("tabindex", "-1"); }
    });
    dots.forEach(function (b, k) { if (k === cur) b.setAttribute("aria-current", "true"); else b.removeAttribute("aria-current"); });
    nameEl.textContent = items[cur].name;
  }

  function tick() {
    clearTimeout(timer);
    if (reduced.matches || paused || !onScreen || document.hidden || items.length < 2) return;
    timer = setTimeout(function () { show(cur + 1); tick(); }, EVERY);
  }

  function build(found) {
    items = MERCH_SHOWCASE.filter(function (m) { return found[m.slug]; }).map(function (m) {
      return { name: m.name, url: found[m.slug] };
    });
    if (!items.length) return;
    stage.textContent = "";
    items.forEach(function (it) {
      const a = document.createElement("a");
      a.className = "showcase__card";
      a.href = "merch.html";
      a.setAttribute("aria-label", it.name + ", shop merch");
      const im = document.createElement("img");
      im.src = it.url;
      im.alt = "";
      a.appendChild(im);
      stage.appendChild(a);
      cards.push(a);
    });
    if (items.length > 1) {
      items.forEach(function (it, k) {
        const b = document.createElement("button");
        b.type = "button";
        b.setAttribute("aria-label", "Show " + it.name);
        b.addEventListener("click", function () { show(k); tick(); });
        dotsEl.appendChild(b);
        dots.push(b);
      });
      dotsEl.hidden = false;
    }
    show(0);
    box.addEventListener("mouseenter", function () { paused = true; tick(); });
    box.addEventListener("mouseleave", function () { paused = false; tick(); });
    box.addEventListener("focusin", function () { paused = true; tick(); });
    box.addEventListener("focusout", function () { paused = false; tick(); });
    document.addEventListener("visibilitychange", tick);
    if (reduced.addEventListener) reduced.addEventListener("change", tick);
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (e) { onScreen = e[0].isIntersecting; tick(); }).observe(box);
    }
    tick();
  }

  lookup().then(function (found) {
    const keys = Object.keys(found);
    return Promise.all(keys.map(function (k) { return preload(found[k]); })).then(function (ok) {
      const good = {};
      keys.forEach(function (k, i) { if (ok[i]) good[k] = found[k]; });
      build(good);
    });
  }).catch(function () { /* keep the emote card */ });
})();

/* UPC band: a few embers rising over the artwork (teal on the left half, red-orange on the right). */
(function upcEmbers() {
  const panel = document.getElementById("upc-band");
  const canvas = document.getElementById("upc-embers");
  if (!panel || !canvas) return;
  const ctx = canvas.getContext("2d");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const COUNT = 14;
  let w = 0, h = 0, list = [], raf = 0, onScreen = true;

  function make(first) {
    return {
      x: Math.random() * w,
      y: first ? Math.random() * h : h + 6,
      r: 0.8 + Math.random() * 1.8,
      v: 0.25 + Math.random() * 0.45,
      ph: Math.random() * Math.PI * 2,
      sw: 0.15 + Math.random() * 0.35,
      a: 0.5 + Math.random() * 0.5
    };
  }
  function resize() {
    const dpr = window.devicePixelRatio || 1;
    w = panel.clientWidth;
    h = panel.clientHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!list.length) for (let i = 0; i < COUNT; i++) list.push(make(true));
    list.forEach(function (e) { if (e.x > w) e.x = Math.random() * w; });
    draw();
  }
  function draw() {
    ctx.clearRect(0, 0, w, h);
    list.forEach(function (e) {
      const fade = Math.min(1, e.y / (h * 0.35), (h - e.y) / 30);   // fades out toward the top, in at the bottom
      const a = Math.max(0, fade) * e.a;
      const col = e.x < w / 2 ? "25,199,154" : "255,120,60";
      const g = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.r * 4);
      g.addColorStop(0, "rgba(" + col + "," + a.toFixed(3) + ")");
      g.addColorStop(1, "rgba(" + col + ",0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.r * 4, 0, Math.PI * 2);
      ctx.fill();
    });
  }
  function step() {
    list.forEach(function (e, i) {
      e.y -= e.v;
      e.ph += 0.02;
      e.x += Math.sin(e.ph) * e.sw;
      if (e.y < -8) list[i] = make(false);
    });
    draw();
    raf = requestAnimationFrame(step);
  }
  function start() {
    cancelAnimationFrame(raf);
    if (reduced.matches || document.hidden || !onScreen) return;
    raf = requestAnimationFrame(step);
  }
  window.addEventListener("resize", resize);
  document.addEventListener("visibilitychange", start);
  if (reduced.addEventListener) reduced.addEventListener("change", start);
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (e) { onScreen = e[0].isIntersecting; start(); }).observe(panel);
  }
  resize();
  start();
})();

/* Page-visibility flag: lets the header UPC pill pause its little animations when the tab is in the background. */
(function tabVisibility() {
  function sync() { document.documentElement.classList.toggle("is-tab-hidden", document.hidden); }
  document.addEventListener("visibilitychange", sync);
  sync();
})();

/* Merch band: frost sparkles, and the band's animations only run while it is on screen and the tab is visible. */
(function merchFx() {
  const panel = document.getElementById("merch-panel");
  const box = document.getElementById("merch-sparkles");
  if (!panel || !box) return;
  const COUNT = 16;   // how many sparkles
  const frag = document.createDocumentFragment();
  for (let i = 0; i < COUNT; i++) {
    const s = document.createElement("i");
    s.style.setProperty("--x", (4 + Math.random() * 92).toFixed(1) + "%");
    s.style.setProperty("--y", (18 + Math.random() * 74).toFixed(1) + "%");
    s.style.setProperty("--s", (5 + Math.random() * 6).toFixed(1) + "px");
    s.style.setProperty("--d", (5 + Math.random() * 5).toFixed(1) + "s");
    s.style.setProperty("--dl", (-Math.random() * 10).toFixed(1) + "s");
    frag.appendChild(s);
  }
  box.appendChild(frag);

  let onScreen = false;
  function sync() { panel.classList.toggle("is-live", onScreen && !document.hidden); }
  document.addEventListener("visibilitychange", sync);
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (e) { onScreen = e[0].isIntersecting; sync(); }).observe(panel);
  } else { onScreen = true; sync(); }
})();

/* "Going deeper" background: nautical depth contours (drawn here), parallax as you scroll,
   and now and then a very faint whale gliding past once you are below the hero. */
(function deepBackground() {
  const root = document.getElementById("deep");
  const pat = document.getElementById("deep-pat");
  const pools = document.getElementById("deep-pools");
  const contours = document.getElementById("deep-contours");
  const life = document.getElementById("deep-life");
  if (!root || !pat || !pools || !contours) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const NS = "http://www.w3.org/2000/svg";
  const CONTOUR_SPEED = 0.15;   // how fast the contours drift up, compared with the page
  const POOL_SPEED = 0.08;      // the light pools drift up more slowly

  /* Sea life: faint creatures that swim past in the dark, a few at a time (never under reduced motion).
     THINGS YOU CAN EDIT:
     CREATURES = what can show up. "type" is whale, fish (a whole school), shark, turtle or jellyfish.
       "seconds" = how long one crossing takes (jellyfish rise from the bottom to the top instead).
       Remove a line to never see that creature, or copy a line to make it show up more often.
     CREATURE_EVERY = a new one appears every so many seconds, picked at random between these two numbers.
     MAX_AT_ONCE = most creatures on screen at the same time.
     Calm mode for other pages: put data-sea-life="calm" on a page's <body> for one creature every 18 to 35 seconds
     (never more than one on screen, smaller fish schools, no whale), or data-sea-life="off" for none.
     The home page has no attribute, so it keeps the busy settings above. */
  const SEA_LIFE = document.body.dataset.seaLife || "";
  const CALM = SEA_LIFE === "calm";
  const CREATURES = [
    { type: "whale", seconds: 60 },
    { type: "fish", seconds: 40 },
    { type: "fish", seconds: 32 },       // fish are listed three times so schools show up most often
    { type: "fish", seconds: 48 },
    { type: "shark", seconds: 55 },
    { type: "turtle", seconds: 70 },
    { type: "jellyfish", seconds: 40 },
    { type: "jellyfish", seconds: 50 }
  ];
  const CREATURE_EVERY = CALM ? [18, 35] : [3, 8];
  const MAX_AT_ONCE = CALM ? 1 : 5;

  /* Contour clusters are scattered at random (but with a fixed seed, so the page looks the same on every
     reload). They are rebuilt when the page gets a lot taller or wider.
     THINGS YOU CAN EDIT: the numbers just below. */
  const SEED = 20240611;
  /* Clusters come in rows down the page. Each row has 1 to 3 clusters at random spots across the width.
     Each size: [smallest, biggest outer ring in px, fewest rings, most rings, share of clusters]. */
  const SIZES = [
    [60, 160, 2, 4, 0.58],       // small (most of them)
    [160, 300, 3, 5, 0.30],      // medium
    [300, 480, 4, 6, 0.12]       // large (a few)
  ];
  const PER_ROW = [1, 3];        // clusters per row
  const GAP = [120, 380];        // vertical gap between rows, px
  const LABEL_CHANCE = 0.4;      // share of clusters that show depth numbers

  function mulberry32(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function radiusAt(r, ang, seed, irr) {
    return r * (1 + irr * (0.16 * Math.sin(ang * 2 + seed) + 0.09 * Math.sin(ang * 3 + seed * 1.7 + 1) + 0.05 * Math.sin(ang * 5 + seed * 0.6)));
  }
  function smoothPath(pts) {   // closed Catmull-Rom curve as bezier segments
    const n = pts.length;
    let d = "M" + pts[0][0].toFixed(1) + " " + pts[0][1].toFixed(1);
    for (let i = 0; i < n; i++) {
      const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
      d += " C" + (p1[0] + (p2[0] - p0[0]) / 6).toFixed(1) + " " + (p1[1] + (p2[1] - p0[1]) / 6).toFixed(1) +
        " " + (p2[0] - (p3[0] - p1[0]) / 6).toFixed(1) + " " + (p2[1] - (p3[1] - p1[1]) / 6).toFixed(1) +
        " " + p2[0].toFixed(1) + " " + p2[1].toFixed(1);
    }
    return d + "Z";
  }
  function layerSize() {   // same height the CSS gives the layer: viewport + the extra the parallax needs
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    return { w: window.innerWidth, h: window.innerHeight + (reduced.matches ? 0 : maxScroll * CONTOUR_SPEED + 40) };
  }
  let built = null;
  function buildContours(force) {
    const size = layerSize();
    if (!force && built && Math.abs(size.w - built.w) / built.w < 0.15 && Math.abs(size.h - built.h) / built.h < 0.2) return;
    built = size;
    while (pat.firstChild) pat.removeChild(pat.firstChild);
    const rnd = mulberry32(SEED);
    const between = function (lo, hi) { return lo + rnd() * (hi - lo); };
    const ZONES = [[-0.08, 0.34], [0.24, 0.76], [0.66, 1.08]];   // left (partly off-screen), middle, right; they overlap so clusters don't line up in columns
    let rowY = between(20, 150);
    let lastRow = [];   // zones used in the previous row, so the next row prefers other spots
    const placed = [];   // clusters already drawn: {x, y, r} (r = biggest reach, so squash is ignored on purpose)
    const MIN_GAP = 24;
    const heroH = window.innerHeight;
    while (rowY < size.h + 200) {
      const count = Math.round(between(PER_ROW[0], PER_ROW[1]));
      const zones = ZONES.slice();
      for (let z = zones.length - 1; z > 0; z--) { const j = Math.floor(rnd() * (z + 1)); const t = zones[z]; zones[z] = zones[j]; zones[j] = t; }
      zones.sort(function (a, b) { return (lastRow.indexOf(a) > -1) - (lastRow.indexOf(b) > -1); });   // fresh zones first
      const usedNow = [];
      let rowTall = 0;
      for (let c = 0; c < count; c++) {
      let sz, R, x, y, ok = false;
      for (let tries = 0; tries < 12 && !ok; tries++) {
        const roll = rnd();
        let acc = 0;
        sz = SIZES[0];
        for (let s = 0; s < SIZES.length; s++) { acc += SIZES[s][4]; if (roll < acc) { sz = SIZES[s]; break; } }
        R = between(sz[0], sz[1]);
        x = between(zones[c][0], zones[c][1]) * size.w;
        y = rowY + between(-60, 60);                        // little vertical wobble inside the row
        if (R > 300 && y < heroH * 2.2) continue;           // no big clusters just below the hero
        ok = true;
        for (let q = 0; q < placed.length; q++) {
          const o = placed[q];
          if (Math.hypot(o.x - x, o.y - y) < o.r + R + 20 + MIN_GAP) { ok = false; break; }   // 20 = ring offset
        }
      }
      if (!ok) continue;
      usedNow.push(zones[c]);
      placed.push({ x: x, y: y, r: R });
      rowTall = Math.max(rowTall, R);
      const n = Math.round(between(sz[2], sz[3]));
      const irr = between(0.6, 1.7);
      const rot = between(0, Math.PI * 2);
      const ex = between(0.65, 1);                           // squash, so the rotation is visible
      const seed = between(0, 10);
      const labelled = rnd() < LABEL_CHANCE;
      const step = 10 + Math.round(rnd() * 4) * 10;
      for (let k = 0; k < n; k++) {
        const rr = R * (n - k) / n;
        const sd = seed + k * 0.18;
        const cx = x + k * 5, cy = y - k * 4;
        const pts = [];
        for (let i = 0; i < 16; i++) {
          const a = i / 16 * Math.PI * 2, r = radiusAt(rr, a, sd, irr);
          const px = Math.cos(a) * r * ex, py = Math.sin(a) * r;
          pts.push([cx + px * Math.cos(rot) - py * Math.sin(rot), cy + px * Math.sin(rot) + py * Math.cos(rot)]);
        }
        const path = document.createElementNS(NS, "path");
        path.setAttribute("d", smoothPath(pts));
        pat.appendChild(path);
        if (labelled && k % 2 === 0) {   // a depth number on every other ring
          const p = pts[(k * 5 + 3) % 16];
          const t = document.createElementNS(NS, "text");
          t.setAttribute("x", p[0].toFixed(1));
          t.setAttribute("y", (p[1] + 4).toFixed(1));
          t.textContent = step * (k + 1);
          pat.appendChild(t);
        }
      }
      }
      lastRow = usedNow;
      rowY += rowTall * 0.3 + between(GAP[0], GAP[1]);       // uneven spacing
    }
  }
  buildContours(true);
  let rebuildTimer = 0;
  function scheduleRebuild() { clearTimeout(rebuildTimer); rebuildTimer = setTimeout(function () { buildContours(false); }, 250); }

  /* Parallax */
  let ticking = false;
  function sizeLayers() {
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const extra = reduced.matches ? 0 : maxScroll * CONTOUR_SPEED + 40;   // contours move fastest, so they need the most extra height
    pools.style.setProperty("--extra", extra + "px");
    contours.style.setProperty("--extra", extra + "px");
  }
  function place() {
    ticking = false;
    const y = window.scrollY || window.pageYOffset || 0;
    if (reduced.matches) { contours.style.transform = ""; pools.style.transform = ""; return; }
    contours.style.transform = "translate3d(0," + (-y * CONTOUR_SPEED).toFixed(1) + "px,0)";
    pools.style.transform = "translate3d(0," + (-y * POOL_SPEED).toFixed(1) + "px,0)";
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(place); } }
  function refresh() { sizeLayers(); place(); scheduleRebuild(); }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", refresh);
  window.addEventListener("load", refresh);
  if ("ResizeObserver" in window) new ResizeObserver(refresh).observe(document.body);   // page height changes as content loads
  refresh();

  /* Sea life: only below the hero, never under reduced motion. Every drawing's head points LEFT, so the
     script flips it (scaleX(-1)) when the creature swims to the right. */
  if (!life || !life.animate || SEA_LIFE === "off") return;
  const hero = document.querySelector(".hero");
  const FISH = '<svg viewBox="0 0 40 20" focusable="false"><path d="M2 10 C8 2 20 2 28 10 C20 18 8 18 2 10Z"/><path class="tail" d="M26 10 L38 2 L36 10 L38 18Z"/></svg>';
  const ART = {
    whale: '<svg viewBox="0 0 240 92" focusable="false"><path d="M4 50 C20 22 70 14 120 22 C165 29 188 44 214 44 L236 28 C234 42 232 54 240 66 L214 58 C190 70 150 74 110 72 C60 70 20 66 4 50Z"/><path d="M110 70 C118 84 132 90 146 90 C138 82 136 76 134 72Z"/></svg>',
    shark: '<svg viewBox="0 0 260 80" focusable="false"><path d="M4 44 C30 30 80 24 130 26 C170 28 200 36 226 40 L254 18 C250 34 248 44 256 66 L228 52 C200 56 160 60 120 58 C70 58 30 54 4 44Z"/><path d="M112 27 L142 3 L154 29Z"/><path d="M84 52 L66 76 L106 56Z"/></svg>',
    turtle: '<svg viewBox="0 0 120 80" focusable="false"><path d="M28 40 C28 16 84 12 98 40 C94 60 40 62 28 40Z"/><ellipse cx="17" cy="40" rx="12" ry="8"/><path d="M98 38 L112 40 L98 44Z"/><path class="tt-fl" d="M46 30 C38 14 30 8 20 8 C28 18 36 28 48 36Z"/><path class="tt-fl tt-fl--b" d="M46 50 C38 66 30 72 20 72 C28 62 36 52 48 44Z"/><path d="M88 32 L106 22 L98 38Z"/><path d="M88 48 L106 58 L98 42Z"/></svg>',
    jellyfish: '<svg viewBox="0 0 40 70" focusable="false"><path class="jf-bell" d="M4 24 C4 6 36 6 36 24 C30 21 26 26 20 22 C14 26 10 21 4 24Z"/><g class="jf-t"><path d="M10 24 Q5 38 11 52 T10 68"/><path d="M16 23 Q12 40 17 54 T15 66"/><path d="M24 23 Q28 38 23 52 T26 66"/><path d="M30 24 Q35 40 29 54 T31 68"/></g></svg>'
  };
  const SWAY = { fish: [6, 3000, "Y"], shark: [18, 7000, "Y"], turtle: [8, 5000, "Y"], jellyfish: [14, 4500, "X"] };   // [distance px, ms, axis]
  const live = [];          // creatures on screen: { el, run, sway }
  let timer = 0;
  const rand = function (lo, hi) { return lo + Math.random() * (hi - lo); };

  function build(type) {   // returns the outer element, with a sway layer and a flip layer inside
    const outer = document.createElement("div");
    outer.className = "creature creature--" + type;
    const sway = document.createElement("div");
    sway.className = "creature__sway";
    const flip = document.createElement("div");
    flip.className = "creature__flip";
    if (type === "fish") {
      const n = Math.round(CALM ? rand(5, 8) : rand(10, 18));
      for (let i = 0; i < n; i++) {   // a loose pack: each fish has its own spot, size, bob and tail speed
        const f = document.createElement("span");
        f.className = "fish";
        const a = rand(0, Math.PI * 2), r = Math.sqrt(Math.random());
        f.style.left = (46 + Math.cos(a) * r * 40 - 8).toFixed(1) + "%";
        f.style.top = (46 + Math.sin(a) * r * 38 - 10).toFixed(1) + "%";
        f.style.width = rand(14, 26).toFixed(0) + "px";
        f.style.setProperty("--bd", rand(1.1, 2.2).toFixed(2) + "s");
        f.style.setProperty("--td", rand(0.45, 0.85).toFixed(2) + "s");
        f.style.setProperty("--dl", (-rand(0, 2)).toFixed(2) + "s");
        f.innerHTML = FISH;
        flip.appendChild(f);
      }
    } else {
      flip.innerHTML = ART[type];
    }
    if (type === "jellyfish") outer.style.width = rand(40, 70).toFixed(0) + "px";
    sway.appendChild(flip);
    outer.appendChild(sway);
    return { outer: outer, sway: sway, flip: flip };
  }

  function spawn() {
    if (live.length >= MAX_AT_ONCE) return;
    const pool = CALM ? CREATURES.filter(function (c) { return c.type !== "whale"; }) : CREATURES;
    const def = pool[Math.floor(Math.random() * pool.length)];
    if (!def || (def.type !== "fish" && !ART[def.type])) return;
    const vw = window.innerWidth, vh = window.innerHeight;
    const heroBottom = hero ? hero.getBoundingClientRect().bottom : 0;
    const rises = def.type === "jellyfish";
    if (heroBottom > (rises ? vh * 0.4 : vh - 140)) return;   // hero still in the way: skip this time
    const c = build(def.type);
    life.appendChild(c.outer);
    const w = c.outer.offsetWidth, h = c.outer.offsetHeight;
    const dur = def.seconds * 1000;
    const toRight = Math.random() < 0.5;
    let frames;
    if (rises) {
      const x0 = rand(0.08, 0.85) * vw, x1 = x0 + rand(-70, 70);
      const yFrom = vh + 20, yTo = -h - 20;
      const at = function (t) { return "translate3d(" + (x0 + (x1 - x0) * t).toFixed(1) + "px," + (yFrom + (yTo - yFrom) * t).toFixed(1) + "px,0)"; };
      frames = [
        { transform: at(0), opacity: 0 },
        { transform: at(0.1), opacity: 1, offset: 0.1 },
        { transform: at(0.9), opacity: 1, offset: 0.9 },
        { transform: at(1), opacity: 0 }
      ];
    } else {
      const minTop = Math.max(vh * 0.1, heroBottom + 16), maxTop = vh - h - 16;
      if (maxTop < minTop) { life.removeChild(c.outer); return; }
      const y = rand(minTop, maxTop).toFixed(0);
      const from = toRight ? -w - 20 : vw + 20;
      const to = toRight ? vw + 20 : -w - 20;
      c.flip.style.transform = toRight ? "scaleX(-1)" : "";   // drawings face left, flip them for rightward travel
      const at = function (t) { return "translate3d(" + (from + (to - from) * t).toFixed(1) + "px," + y + "px,0)"; };
      frames = [
        { transform: at(0), opacity: 0 },
        { transform: at(0.1), opacity: 1, offset: 0.1 },
        { transform: at(0.9), opacity: 1, offset: 0.9 },
        { transform: at(1), opacity: 0 }
      ];
    }
    const item = { el: c.outer, run: c.outer.animate(frames, { duration: dur, easing: "linear" }), sway: null };
    const sw = SWAY[def.type];
    if (sw) {
      item.sway = c.sway.animate([
        { transform: "translate" + sw[2] + "(" + (-sw[0]) + "px)" },
        { transform: "translate" + sw[2] + "(" + sw[0] + "px)" }
      ], { duration: sw[1], easing: "ease-in-out", direction: "alternate", iterations: Infinity });
    }
    if (document.hidden) { item.run.pause(); if (item.sway) item.sway.pause(); }
    live.push(item);
    item.run.onfinish = item.run.oncancel = function () {   // remove it once it has left
      const i = live.indexOf(item);
      if (i > -1) live.splice(i, 1);
      if (item.sway) item.sway.cancel();
      if (item.el.parentNode) item.el.parentNode.removeChild(item.el);
    };
  }
  function schedule() {
    clearTimeout(timer);
    if (reduced.matches || document.hidden) return;
    timer = setTimeout(function () {
      if (!document.hidden && !reduced.matches) spawn();
      schedule();
    }, rand(CREATURE_EVERY[0], CREATURE_EVERY[1]) * 1000);
  }
  document.addEventListener("visibilitychange", function () {
    root.classList.toggle("is-paused", document.hidden);
    live.forEach(function (it) {
      if (document.hidden) { it.run.pause(); if (it.sway) it.sway.pause(); }
      else { it.run.play(); if (it.sway) it.sway.play(); }
    });
    if (document.hidden) clearTimeout(timer); else schedule();
  });
  if (reduced.addEventListener) reduced.addEventListener("change", function () {
    refresh();
    if (reduced.matches) { clearTimeout(timer); live.slice().forEach(function (it) { it.run.cancel(); }); } else schedule();
  });
  schedule();
})();

/* =====================================================================
   THINGS YOU CAN EDIT (no coding needed, just change the text in quotes)
   ---------------------------------------------------------------------
   LINKS   : where the buttons go. Change a web address between the quotes.

   TRAILER : the one trailer video in The Vault.
               id     the YouTube ID (the bit after v= in the link)
               title  what shows under the player      length  like "2:06"

   EVENTS  : the list of events, NEWEST FIRST. Each event gets a card in the
             "Events" tab, and its fight cuts show up in "Individual fights".
             To add Event #2: copy the whole Event #1 block (from the opening {
             to its closing },) and paste it ABOVE Event #1, then change:
               name     like "Event #2"
               vod      the full VOD: { id: "YOUTUBE_ID", title: "...", length: "3:57:42" }
               fights   one line per fight cut: { id: "YOUTUBE_ID", title: "...", length: "18:38" }
             Add or remove fight lines as you like. Keep the commas.

   MODES   : the game modes. Each has:
               name   the mode name
               short  the short name used on phones
               line   the one-line description
               video  YouTube ID of the rules video          length  the video length
               maps   OPTIONAL. Use this instead of video/length when a mode has several maps
                      (like Search and Destroy). One line per map, first one shows first:
                      { name: "Map name", id: "YOUTUBE_ID", length: "1:54" }
               icon   which little picture to use (flag, keg, fort, ship, swords, vault, siren)

   STATS   : GOATCOUNTER is the visitor-stats code (same one as on the FrostyReal
             pages, e.g. "frostyreal"). Leave it as "" to keep stats off.
   ===================================================================== */

const GOATCOUNTER = "frostyreal";   // same code as on the FrostyReal pages (e.g. "frostyreal"). Leave "" to keep stats off.

var LINKS = {
  discord: "https://discord.gg/4cmBrPPWyA",
  youtube: "https://www.youtube.com/@UltimatePirateChampionship",
  kick: "https://kick.com/frostyreal",
  home: "index.html"
};

var TRAILER = { id: "iX0tV4sFMzI", title: "Official trailer", length: "2:06" };

var EVENTS = [
  {
    name: "Event #1",
    vod: { id: "-UhRoik1hEE", title: "Ultimate Pirate Championship #1 (Full VOD)", length: "3:57:42" },
    fights: [
      { id: "-FT35Ki0V0o", title: "Search and Destroy fight", length: "57:00" },
      { id: "hIhinN9YNxw", title: "Capture the Flag fight", length: "18:38" },
      { id: "jsOGGqZYjhU", title: "Race for Siren Song", length: "40:09" }
    ]
  }
];

var MODES = [
  { id: "ctf", name: "Capture the Flag", short: "Capture the Flag", icon: "flag", line: "The rules, explained in under two minutes.", video: "7uUO9jOiOa0", length: "1:39" },
  { id: "sd", name: "Search and Destroy", short: "S&D", icon: "keg", line: "Plant the bomb or defend the site. Pick your map:",
    maps: [
      { name: "Crescent Isle", id: "ogk3jSibtiA", length: "1:54" },
      { name: "Lone Cove", id: "VkOwYxM2YBY", length: "1:53" },
      { name: "Thieves Haven", id: "Ani-kjnSgOk", length: "2:10" }
    ] },
  { id: "ftdm", name: "Fortress Team Deathmatch", short: "Fort Deathmatch", icon: "fort", line: "Team fights at a skeleton fort.", video: "3orkXFJztGY", length: "1:07" },
  { id: "soc", name: "Seas of Combat", short: "Seas of Combat", icon: "ship", line: "Ship-versus-ship fights in sloops, brigantines and galleons.", video: "FlpmYDsq6hg", length: "0:48" },
  { id: "wwd", name: "World Wide Duel", short: "World Wide Duel", icon: "swords", line: "Sword duels in locations across the map.", video: "ZLMrVBmWqk8", length: "1:01" },
  { id: "rtv", name: "Race for the Vault", short: "Race for the Vault", icon: "vault", line: "A speedrun through a skeleton fort. Win by blowing the vault kegs.", video: "Gf5n8uDU5GA", length: "0:41" },
  { id: "rss", name: "Race for Siren Song", short: "Race for Siren Song", icon: "siren", line: "A race to the Siren Song. Watch the rules video for how it works.", video: "-Pg3Q4gkfzc", length: "1:08" }
];

/* =====================================================================
   Everything below is the page's behaviour. No need to edit it.
   ===================================================================== */

var ICONS = {
  flag: '<path d="M6 21V4 M6 5h11l-2 4 2 4H6"/>',
  keg: '<path d="M7 9c-1.5 3-1.5 8 0 11h10c1.5-3 1.5-8 0-11z M7 9h10 M7.5 12.5h9 M7.5 16.5h9 M12 9V6.5c0-1.5 1.5-2 3-3 M17.5 1.5v3 M16 3h3"/>',
  fort: '<path d="M4 21V8h3v3h3V8h4v3h3V8h3v13z M10 21v-4a2 2 0 014 0v4"/>',
  ship: '<path d="M3 15h18l-3 5H6z M12 3v12 M12 4l6 8h-6 M12 6L7 12h5"/>',
  swords: '<path d="M5 5l12 12 M5 5h4 M5 5v4 M19 5L7 17 M19 5h-4 M19 5v4 M4 20l3-3 M20 20l-3-3"/>',
  vault: '<rect x="4" y="4" width="16" height="16" rx="2"/><circle cx="12" cy="12" r="4"/><path d="M12 8v8 M8 12h8"/>',
  siren: '<circle cx="12" cy="5.5" r="2.5"/><path d="M2 13c3-4 5-4 8 0s5 4 8 0 M2 18.5c3-4 5-4 8 0s5 4 8 0"/>'
};

var IS_FILE = location.protocol === "file:";
var REDUCED = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function ytThumb(id, size) { return "https://i.ytimg.com/vi/" + id + "/" + size + ".jpg"; }
function ytWatch(id) { return "https://www.youtube.com/watch?v=" + id; }
// every mode has a list of maps; a single-video mode just has one unnamed entry
function mapsOf(m) { return m.maps || [{ name: "", id: m.video, length: m.length }]; }
function fullName(m, map) { return map && map.name ? m.name + ": " + map.name : m.name; }

/* Click-to-load video. Shows a thumbnail with a play button; on click swaps in the player. */
function mountVideo(slot, video, opts) {
  opts = opts || {};
  slot.innerHTML = "";
  if (opts.autoplay) { loadPlayer(); return; }
  var b = document.createElement("button");
  b.type = "button";
  b.className = "facade";
  var img = document.createElement("img");
  img.alt = "";
  img.loading = "lazy";
  img.src = ytThumb(video.id, opts.thumb || "hqdefault");
  img.onerror = function () { img.onerror = null; img.src = ytThumb(video.id, "hqdefault"); };
  var play = document.createElement("span");
  play.className = "play";
  var sr = document.createElement("span");
  sr.className = "sr-only";
  sr.textContent = "Play video: " + video.title;
  b.appendChild(img); b.appendChild(play); b.appendChild(sr);
  b.addEventListener("click", function () {
    if (IS_FILE) { window.open(ytWatch(video.id), "_blank", "noopener"); return; }
    loadPlayer();
  });
  slot.appendChild(b);

  function loadPlayer() {
    if (IS_FILE) { window.open(ytWatch(video.id), "_blank", "noopener"); return; }
    slot.innerHTML = "";
    var f = document.createElement("iframe");
    f.src = "https://www.youtube-nocookie.com/embed/" + video.id + "?autoplay=1&rel=0";
    f.title = video.title;
    f.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    f.allowFullscreen = true;
    slot.appendChild(f);
    f.focus();
  }
}

/* Header: solid after scroll, and the active tab follows the section in view */
(function () {
  var hdr = document.getElementById("hdr");
  if (!hdr) return;
  function onScroll() { hdr.classList.toggle("scrolled", window.scrollY > 40); }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  var links = hdr.querySelectorAll("[data-nav]");
  if (!links.length) return;
  // highlight the tab for whichever section crosses the line 40% down the screen
  var ids = ["how", "modes", "vault", "discord"];
  var current = null;
  function pick() {
    var line = window.innerHeight * 0.4, found = null;
    ids.forEach(function (id) {
      var s = document.getElementById(id);
      if (!s) return;
      var r = s.getBoundingClientRect();
      if (r.top <= line && r.bottom > line) found = id;
    });
    if (found === current) return;
    current = found;
    links.forEach(function (a) {
      if (a.getAttribute("data-nav") === found) {
        a.setAttribute("aria-current", "true");
        // keep the active tab visible in the phone's scrolling row
        var row = a.parentNode;
        if (row.scrollWidth > row.clientWidth) row.scrollLeft = a.offsetLeft - 16;
      } else a.removeAttribute("aria-current");
    });
  }
  pick();
  window.addEventListener("scroll", pick, { passive: true });
  window.addEventListener("resize", pick);
})();

/* Hero embers: teal sparks on the left, warm embers on the right */
(function () {
  var cv = document.getElementById("embers");
  if (!cv || REDUCED || !cv.getContext) return;
  var ctx = cv.getContext("2d");
  var w = 0, h = 0, dpr = 1, parts = [], running = false, visible = true, raf = 0;

  function sprite(rgb) {
    var c = document.createElement("canvas");
    c.width = c.height = 32;
    var g = c.getContext("2d");
    var gr = g.createRadialGradient(16, 16, 0, 16, 16, 16);
    gr.addColorStop(0, "rgba(" + rgb + ",1)");
    gr.addColorStop(0.3, "rgba(" + rgb + ",.55)");
    gr.addColorStop(1, "rgba(" + rgb + ",0)");
    g.fillStyle = gr;
    g.fillRect(0, 0, 32, 32);
    return c;
  }
  var teal = sprite("25,199,154"), warm = sprite("255,120,60");

  function make(initial) {
    var x = Math.random() * w;
    return {
      x: x, y: initial ? Math.random() * h : h + 10,
      vy: 0.3 + Math.random() * 0.9, size: 5 + Math.random() * 11,
      ph: Math.random() * 6.28, sw: 0.4 + Math.random() * 0.9,
      img: x < w / 2 ? teal : warm
    };
  }
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    w = cv.clientWidth; h = cv.clientHeight;
    cv.width = w * dpr; cv.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var n = w < 760 ? 20 : 40;
    parts = [];
    for (var i = 0; i < n; i++) parts.push(make(true));
  }
  function frame() {
    ctx.clearRect(0, 0, w, h);
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i];
      p.y -= p.vy; p.ph += 0.02;
      var x = p.x + Math.sin(p.ph) * 18 * p.sw;
      var life = Math.max(0, Math.min(1, p.y / h));
      if (p.y < -20) { parts[i] = make(false); continue; }
      ctx.globalAlpha = Math.min(1, life * 1.6) * 0.9;
      ctx.drawImage(p.img, x - p.size, p.y - p.size, p.size * 2, p.size * 2);
    }
    ctx.globalAlpha = 1;
    raf = running ? requestAnimationFrame(frame) : 0;
  }
  function sync() {
    var should = visible && !document.hidden;
    if (should && !running) { running = true; raf = requestAnimationFrame(frame); }
    if (!should && running) { running = false; cancelAnimationFrame(raf); }
  }
  resize();
  window.addEventListener("resize", resize);
  document.addEventListener("visibilitychange", sync);
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (e) { visible = e[0].isIntersecting; sync(); }).observe(cv);
  }
  sync();
})();

/* Ambient embers: a sparse, dim field fixed behind every section below the hero (teal on the left, warm on the right).
   Off completely under reduced motion, and paused while the tab is hidden. */
(function () {
  var cv = document.getElementById("amb-cv");
  if (!cv || !cv.getContext) return;
  var mql = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
  if (REDUCED) return;
  var ctx = cv.getContext("2d");
  var w = 0, h = 0, dpr = 1, parts = [], running = false, raf = 0;

  function sprite(rgb) {
    var c = document.createElement("canvas");
    c.width = c.height = 32;
    var g = c.getContext("2d");
    var gr = g.createRadialGradient(16, 16, 0, 16, 16, 16);
    gr.addColorStop(0, "rgba(" + rgb + ",1)");
    gr.addColorStop(0.2, "rgba(" + rgb + ",.8)");
    gr.addColorStop(1, "rgba(" + rgb + ",0)");
    g.fillStyle = gr;
    g.fillRect(0, 0, 32, 32);
    return c;
  }
  var teal = sprite("25,199,154"), red = sprite("224,50,60"), orange = sprite("255,150,80");

  function make(initial) {
    var x = Math.random() * w;
    return {
      x: x, y: initial ? Math.random() * h : h + 10,
      vy: 0.12 + Math.random() * 0.3, size: 1 + Math.random() * 1.5,
      ph: Math.random() * 6.28, sw: 0.3 + Math.random() * 0.7,
      a: 0.15 + Math.random() * 0.3,
      img: x < w / 2 ? teal : (Math.random() < 0.5 ? red : orange)
    };
  }
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    w = cv.clientWidth; h = cv.clientHeight;
    cv.width = w * dpr; cv.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var n = w < 760 ? 18 : 36;
    parts = [];
    for (var i = 0; i < n; i++) parts.push(make(true));
  }
  function frame() {
    ctx.clearRect(0, 0, w, h);
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i];
      p.y -= p.vy; p.ph += 0.008;
      if (p.y < -10) { parts[i] = make(false); continue; }
      var x = p.x + Math.sin(p.ph) * 16 * p.sw;
      // fade in just after spawning at the bottom, fade out as it rises
      var life = Math.min(1, (h - p.y) / (h * 0.12)) * Math.max(0, Math.min(1, p.y / (h * 0.85)));
      ctx.globalAlpha = p.a * life;
      var d = p.size * 5;
      ctx.drawImage(p.img, x - d / 2, p.y - d / 2, d, d);
    }
    ctx.globalAlpha = 1;
    raf = running ? requestAnimationFrame(frame) : 0;
  }
  function sync() {
    var should = !document.hidden && !(mql && mql.matches);
    if (should && !running) { running = true; raf = requestAnimationFrame(frame); }
    if (!should && running) { running = false; cancelAnimationFrame(raf); ctx.clearRect(0, 0, w, h); }
  }
  resize();
  window.addEventListener("resize", resize);
  document.addEventListener("visibilitychange", sync);
  if (mql) { if (mql.addEventListener) mql.addEventListener("change", sync); else if (mql.addListener) mql.addListener(sync); }
  sync();
})();

/* How it works: the page's only scroll reveal. The route draws itself, medallions 1 and 2 pop in, the step 3 medallion thumps in. Once only. */
(function () {
  var chart = document.getElementById("chart");
  if (!chart || REDUCED || !("IntersectionObserver" in window)) return;
  document.documentElement.classList.add("js-reveal");
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { chart.classList.add("in"); io.disconnect(); }
    });
  }, { threshold: 0.3 });
  io.observe(chart);
})();

/* Game modes: a tab list on the left, the picked mode's rules on the right */
(function () {
  var list = document.getElementById("mode-list");
  var panel = document.getElementById("mode-panel");
  if (!list || !panel) return;

  var fade = document.getElementById("mode-fade");
  var player = document.getElementById("mode-player");
  var nameEl = document.getElementById("mode-name");
  var lineEl = document.getElementById("mode-line");
  var ytEl = document.getElementById("mode-yt");
  var lenEl = document.getElementById("mode-len");
  var mapsEl = document.getElementById("mode-maps");
  var tabs = [], current = 0, timer = 0, curMode = null, curMap = 0, pills = [];

  MODES.forEach(function (m, i) {
    var b = document.createElement("button");
    b.type = "button"; b.className = "mtab"; b.id = "mode-tab-" + m.id;
    b.setAttribute("role", "tab"); b.setAttribute("aria-controls", "mode-panel");
    b.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true">' + ICONS[m.icon] + '</svg>' +
      '<span class="t-full"><span class="t-name"></span>' + (m.maps ? '<span class="t-map"></span>' : "") + '</span>' +
      '<span class="t-short"></span><span class="t-len" aria-hidden="true"></span>';
    b.querySelector(".t-name").textContent = m.name;
    if (m.maps) b.querySelector(".t-map").textContent = m.maps.length + " maps";
    b.querySelector(".t-short").textContent = m.short || m.name;
    b.querySelector(".t-len").textContent = m.maps ? "" : m.length;
    b.addEventListener("click", function () { select(i, false, true); });
    list.appendChild(b); tabs.push(b);
  });

  list.addEventListener("keydown", function (e) {
    var cur = tabs.indexOf(document.activeElement);
    if (cur < 0) return;
    var next = -1;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") next = (cur + 1) % tabs.length;
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = (cur - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = tabs.length - 1;
    if (next < 0) return;
    e.preventDefault();
    select(next, true, true);
  });

  // the list is vertical on desktop and a sideways chip row on phones
  var mq = window.matchMedia ? window.matchMedia("(max-width: 820px)") : null;
  function orient() { list.setAttribute("aria-orientation", mq && mq.matches ? "horizontal" : "vertical"); }
  orient();
  if (mq) { if (mq.addEventListener) mq.addEventListener("change", orient); else if (mq.addListener) mq.addListener(orient); }

  // show one map of the picked mode: title, length, links and the rules video
  function showMap(m, i) {
    var map = mapsOf(m)[i];
    curMap = i;
    nameEl.textContent = fullName(m, map);
    lenEl.textContent = "Rules video, " + map.length;
    ytEl.href = ytWatch(map.id);
    // mountVideo swaps the player for a fresh thumbnail, which also stops any video that was playing
    mountVideo(player, { id: map.id, title: fullName(m, map) + " rules video" });
    pills.forEach(function (p, j) { p.setAttribute("aria-pressed", String(j === i)); });
  }

  function paint(m) {
    curMode = m;
    var list = mapsOf(m);
    lineEl.textContent = m.line;
    // map switcher: only for modes with more than one map
    mapsEl.innerHTML = "";
    pills = [];
    mapsEl.hidden = list.length < 2;
    if (list.length > 1) {
      list.forEach(function (map, i) {
        var p = document.createElement("button");
        p.type = "button"; p.className = "mmap"; p.textContent = map.name;
        p.addEventListener("click", function () { showMap(m, i); });
        mapsEl.appendChild(p); pills.push(p);
      });
    }
    showMap(m, 0);
  }

  function select(n, focus, animate) {
    var m = MODES[n];
    tabs.forEach(function (t, i) {
      var on = i === n;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
    });
    panel.setAttribute("aria-labelledby", tabs[n].id);
    if (focus) tabs[n].focus();
    // keep the picked chip in view in the phone's sideways row (scroll the row only, not the page)
    if (list.scrollWidth > list.clientWidth) {
      var t = tabs[n];
      list.scrollTo({ left: t.offsetLeft - (list.clientWidth - t.offsetWidth) / 2, behavior: REDUCED ? "auto" : "smooth" });
    }
    if (n === current && !animate) { paint(m); return; }
    current = n;
    clearTimeout(timer);
    if (!animate || REDUCED) { paint(m); return; }
    // quick crossfade: fade out, swap (this also resets any playing video), fade in
    fade.classList.add("out");
    timer = setTimeout(function () { paint(m); fade.classList.remove("out"); }, 100);
  }

  select(0, false, false);
})();

/* The Vault: Trailer / Events / Individual fights */
(function () {
  var tabsEl = document.getElementById("vault-tabs");
  var panelsEl = document.getElementById("vault-panels");
  if (!tabsEl || !panelsEl) return;

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  // a big player with a title and a "Full VOD, 3:57:42" line under it
  function makeStage() {
    var node = el("div", "vstage");
    var player = el("div", "player");
    var meta = el("div", "vod-meta");
    var title = el("h3", "vod-title");
    var len = el("span", "vod-len");
    meta.appendChild(title); meta.appendChild(len);
    node.appendChild(player); node.appendChild(meta);
    var cur = null;
    return {
      node: node,
      show: function (video, label, autoplay) {
        cur = { video: video, label: label };
        mountVideo(player, video, { thumb: "maxresdefault", autoplay: autoplay });
        title.textContent = video.title;
        len.textContent = label + ", " + video.length;
        if (autoplay && player.getBoundingClientRect().top < 70) {
          player.scrollIntoView({ block: "center", behavior: REDUCED ? "auto" : "smooth" });
        }
      },
      // back to the thumbnail (stops sound when you leave the tab)
      stop: function () { if (cur) this.show(cur.video, cur.label, false); }
    };
  }

  function card(video, tag, name) {
    var b = el("button", "vcard");
    b.type = "button";
    var thumb = el("span", "vthumb");
    var img = document.createElement("img");
    img.alt = ""; img.loading = "lazy"; img.src = ytThumb(video.id, "mqdefault");
    thumb.appendChild(img);
    thumb.appendChild(el("span", "dur", video.length));
    thumb.appendChild(el("span", "vnow", name));
    b.appendChild(thumb);
    return b;
  }

  function buildTrailer() {
    var stage = makeStage();
    stage.show(TRAILER, "Trailer", false);
    return { node: stage.node, stop: function () { stage.stop(); } };
  }

  function buildEvents() {
    var wrap = el("div");
    var stage = makeStage();
    wrap.appendChild(stage.node);
    wrap.appendChild(el("h4", "vsub", "All events"));
    var grid = el("div", "vgrid");
    var cards = [];
    function pick(i, autoplay) {
      stage.show(EVENTS[i].vod, "Full VOD", autoplay);
      cards.forEach(function (c, j) { c.classList.toggle("is-on", j === i); c.setAttribute("aria-pressed", String(j === i)); });
    }
    EVENTS.forEach(function (ev, i) {
      var c = card(ev.vod, null, "Now showing");
      c.appendChild(el("span", "vname", ev.name));
      c.setAttribute("aria-label", ev.name + ", full VOD, " + ev.vod.length);
      c.addEventListener("click", function () { pick(i, true); });
      grid.appendChild(c); cards.push(c);
    });
    // placeholder so the structure is visible while there's only one event
    var soon = el("a", "vcard soon");
    soon.href = LINKS.discord; soon.target = "_blank"; soon.rel = "noopener";
    soon.appendChild(el("span", "vname", "Event #" + (EVENTS.length + 1)));
    soon.appendChild(el("span", "vsoon", "Coming soon. Sign up in the Discord."));
    grid.appendChild(soon);
    wrap.appendChild(grid);
    pick(0, false);
    return { node: wrap, stop: function () { stage.stop(); } };
  }

  function buildFights() {
    var wrap = el("div");
    var stage = makeStage();
    wrap.appendChild(stage.node);
    wrap.appendChild(el("h4", "vsub", "Individual fights"));
    var grid = el("div", "vgrid");
    var cards = [], all = [];
    EVENTS.forEach(function (ev) {
      ev.fights.forEach(function (f) { all.push({ f: f, ev: ev.name }); });
    });
    function pick(i, autoplay) {
      stage.show(all[i].f, "Fight cut", autoplay);
      cards.forEach(function (c, j) { c.classList.toggle("is-on", j === i); c.setAttribute("aria-pressed", String(j === i)); });
    }
    all.forEach(function (x, i) {
      var c = card(x.f, null, "Now playing");
      c.appendChild(el("span", "vtitle", x.f.title));
      c.appendChild(el("span", "vtag", x.ev));
      c.setAttribute("aria-label", x.f.title + ", " + x.ev + ", " + x.f.length);
      c.addEventListener("click", function () { pick(i, true); });
      grid.appendChild(c); cards.push(c);
    });
    wrap.appendChild(grid);
    if (all.length) pick(0, false);
    return { node: wrap, stop: function () { stage.stop(); } };
  }

  var defs = [
    { label: "Trailer", build: buildTrailer },
    { label: "Events", build: buildEvents },
    { label: "Individual fights", build: buildFights }
  ];
  var tabs = [], panels = [], parts = [];

  defs.forEach(function (d, i) {
    var tab = el("button", "vtab", d.label);
    tab.type = "button"; tab.id = "vtab-" + i;
    tab.setAttribute("role", "tab"); tab.setAttribute("aria-controls", "vpanel-" + i);
    tab.addEventListener("click", function () { select(i, false); });
    tabsEl.appendChild(tab); tabs.push(tab);

    var panel = el("div", "vpanel");
    panel.id = "vpanel-" + i;
    panel.setAttribute("role", "tabpanel"); panel.setAttribute("aria-labelledby", tab.id);
    var part = d.build();
    panel.appendChild(part.node);
    panelsEl.appendChild(panel); panels.push(panel); parts.push(part);
  });

  tabsEl.addEventListener("keydown", function (e) {
    var cur = tabs.indexOf(document.activeElement);
    if (cur < 0) return;
    var next = -1;
    if (e.key === "ArrowRight") next = (cur + 1) % tabs.length;
    else if (e.key === "ArrowLeft") next = (cur - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = tabs.length - 1;
    if (next < 0) return;
    e.preventDefault();
    select(next, true);
  });

  function select(n, focus) {
    tabs.forEach(function (t, i) {
      var on = i === n;
      if (!on && !panels[i].hidden) parts[i].stop();
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      panels[i].hidden = !on;
    });
    if (focus) tabs[n].focus();
  }

  select(0, false);
})();

/* Visitor stats (GoatCounter): only loads when GOATCOUNTER above is filled in. */
(function () {
  if (!GOATCOUNTER) return;
  var s = document.createElement("script");
  s.async = true;
  s.setAttribute("data-goatcounter", "https://" + GOATCOUNTER + ".goatcounter.com/count");
  s.src = "https://gc.zgo.at/count.js";
  document.head.appendChild(s);
})();

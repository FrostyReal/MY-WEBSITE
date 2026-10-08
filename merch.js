/* =====================================================================
   MERCH PAGE: pulls your products live from Fourthwall.
   The token below is Fourthwall's PUBLIC storefront token (made to be used on websites).
   ===================================================================== */
(function merch() {
  /* ===================================================================
     THINGS YOU CAN EDIT (no coding needed, just change the text in quotes)
     =================================================================== */

  /* Your best sellers, shown in the big card stack at the top of the page (they swap every few seconds).
     Each one is the end of the product's link on the shop (the last part of its web address).
     Any product works here: tees, hoodies, hats, stickers, anything.
     "image" = which photo of that product to show (0 is the first photo; 1 is usually the back,
     which shows off the big designs). */
  const FEATURED = [
    { slug: "frosty-x-champion-long-sleeve", image: 1 },   // back: the drippy snowman
    { slug: "frosty-t-shirt-white-print", image: 1 },      // back: the wavy FROSTY stack
    { slug: "frosty-relax-unisex-hoodie", image: 1 },      // back: the reclined snowman (Relax)
    { slug: "frosty-drip-cropped-hoodie", image: 0 },
    { slug: "frosty-hat-black", image: 0 }
  ];

  /* Product order on the page. Leave empty to use the order from Fourthwall.
     To set it: open merch.html?arrange, drag the products, then send the order to Claude. */
  const ORDER = [
    "frosty-t-shirt-white-print-2",
    "frosty-t-shirt-black-print-2",
    "frosty-t-shirt-white-print",
    "frosty-t-shirt-black-print",
    "frosty-x-champion-long-sleeve",
    "frosty-drip-cropped-top",
    "frosty-drip-cropped-hoodie",
    "frosty-love-hoodie",
    "frosty-smile-hoodie",
    "frosty-relax-unisex-t-shirt",
    "frosty-relax-cropped-top",
    "frosty-relax-unisex-hoodie",
    "frosty-relax-cropped-hoodie",
    "frosty-joggers-good-vibes",
    "frosty-grey-sweatpants",
    "frosty-relax-fleece-shorts",
    "frosty-relax-unisex-athletic-shorts",
    "frosty-beanie-black-logo",
    "frosty-beanie-white-logo",
    "frosty-hat-black",
    "frosty-hat-white",
    "frosty-sticker",
    "frosty-sticker-white",
    "frosty-relax-sticker",
    "frosty-wavy-iphone-case",
    "frosty-relax-water-bottle",
    "frosty-relax-baby-t-shirt"
  ];
  /* =================================================================== */

  const TOKEN = "ptkn_f1befabb-7502-4c1a-8482-1ea6ef1f4926";
  const API = "https://storefront-api.fourthwall.com/v1";
  const SHOP = "https://frostyrealkick-shop.fourthwall.com";
  const CUR = "USD";
  const ARRANGE = /[?&]arrange\b/.test(location.search);
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

  const $ = function (id) { return document.getElementById(id); };
  const money = function (v) { return "$" + Number(v).toFixed(2); };
  const el = function (tag, cls, text) { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };

  let products = [];
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem("fr_cart") || "[]"); } catch (e) { cart = []; }
  if (!Array.isArray(cart)) cart = [];
  function saveCart() { try { localStorage.setItem("fr_cart", JSON.stringify(cart)); } catch (e) {} }

  /* ---------- helpers for variants ---------- */
  const colorOf = function (v) { return v.attributes && v.attributes.color ? v.attributes.color : null; };
  const sizeLabel = function (v) { const a = v.attributes || {}; return (a.size && a.size.name) || a.description || v.name; };
  const hasSize = function (p) { return p.variants.some(function (v) { return v.attributes && v.attributes.size; }); };
  const soldOut = function (v) { return !!(v.stock && v.stock.inStock === 0); };
  const allSoldOut = function (p) { return p.variants.every(soldOut); };
  function colorsOf(p) {
    const seen = {}, out = [];
    p.variants.forEach(function (v) { const c = colorOf(v); if (c && !seen[c.name]) { seen[c.name] = 1; out.push(c); } });
    return out;
  }
  function imagesFor(p, color) {
    if (color) {
      const v = p.variants.find(function (x) { const c = colorOf(x); return c && c.name === color && x.images && x.images.length; });
      if (v) return v.images;
    }
    return p.images || [];
  }
  const minPrice = function (p) { return Math.min.apply(null, p.variants.map(function (v) { return v.unitPrice.value; })); };
  const maxPrice = function (p) { return Math.max.apply(null, p.variants.map(function (v) { return v.unitPrice.value; })); };
  function priceText(p, short) {
    const lo = minPrice(p), hi = maxPrice(p);
    if (lo === hi) return money(lo);
    return short ? "From " + money(lo) : money(lo) + " – " + money(hi);
  }
  function plain(html) { const d = document.createElement("div"); d.innerHTML = (html || "").replace(/<\/p>|<br\s*\/?>|<\/li>/gi, "\n"); return (d.textContent || "").trim(); }

  /* ---------- product types (worked out from the product's name) ---------- */
  const TYPES = [
    { id: "tees", label: "Tees" },
    { id: "hoodies", label: "Hoodies" },
    { id: "crop", label: "Crop tops" },
    { id: "bottoms", label: "Bottoms" },
    { id: "hats", label: "Hats" },
    { id: "stickers", label: "Stickers" },
    { id: "extras", label: "Extras" }
  ];
  function typeOf(p) {
    const n = (p.name + " " + p.slug).toLowerCase();
    if (/sticker/.test(n)) return "stickers";
    if (/\b(hat|beanie|cap)\b/.test(n)) return "hats";
    if (/crop/.test(n)) return "crop";
    if (/hoodie/.test(n)) return "hoodies";
    if (/shorts|sweatpant|jogger/.test(n)) return "bottoms";
    if (/\btee\b|t-shirt|shirt|long sleeve|long-sleeve/.test(n)) return "tees";
    return "extras";
  }
  const APPAREL = { tees: 1, hoodies: 1, crop: 1, bottoms: 1 };

  /* Photos: every photo sits on the same light grey (set in merch.css), so there's nothing to adjust here. */
  function prep(img, url) { if (url) img.src = url; }

  /* ---------- load products ---------- */
  async function fetchAll() {
    let page = 0, out = [];
    while (page < 10) {
      const r = await fetch(API + "/collections/all/products?storefront_token=" + TOKEN + "&currency=" + CUR + "&page=" + page);
      if (!r.ok) throw new Error("status " + r.status);
      const j = await r.json();
      out = out.concat(j.results || []);
      if (!j.paging || !j.paging.hasNextPage) break;
      page++;
    }
    return out.filter(function (p) { return (!p.state || p.state.type === "AVAILABLE") && p.variants && p.variants.length; });
  }

  /* ---------- the shop grid ---------- */
  let filter = "all";

  function skeletonGrid() {
    const grid = $("shop-grid");
    grid.textContent = "";
    for (let i = 0; i < 8; i++) {
      const li = el("li");
      const card = el("span", "card is-skel");
      const meta = el("span", "card__meta");
      meta.appendChild(el("span", "skel-line")); meta.appendChild(el("span", "skel-line skel-line--s"));
      card.appendChild(el("span", "card__photo")); card.appendChild(meta);
      li.appendChild(card);
      grid.appendChild(li);
    }
    $("shop-live").textContent = "Loading the merch...";
  }

  function showStatus(msg, withLink) {
    const box = $("shop-status");
    box.textContent = "";
    box.className = "shop-status" + (withLink ? " shop-status--error" : "");
    if (!msg) return;
    box.appendChild(el(withLink ? "p" : "span", null, msg));
    if (withLink) {
      const a = el("a", "pill pill--primary", "Open the Fourthwall store");
      a.href = SHOP + "/"; a.target = "_blank"; a.rel = "noopener";
      box.appendChild(a);
    }
  }

  function visibleProducts() {
    if (ARRANGE || filter === "all") return products;
    return products.filter(function (p) { return typeOf(p) === filter; });
  }

  function renderGrid() {
    const grid = $("shop-grid");
    grid.textContent = "";
    const list = visibleProducts();
    list.forEach(function (p) {
      const li = el("li"); li.dataset.slug = p.slug;
      const b = el("button", "card" + (allSoldOut(p) ? " is-out" : ""));
      b.type = "button";
      const photo = el("span", "card__photo");
      const first = (p.images || [])[0];
      if (first) { const im = el("img"); im.alt = p.name; im.loading = "lazy"; prep(im, first.url); photo.appendChild(im); }
      if (allSoldOut(p)) photo.appendChild(el("span", "card__badge", "Sold out"));
      const meta = el("span", "card__meta");
      meta.appendChild(el("span", "card__name", p.name));
      meta.appendChild(el("span", "card__price", priceText(p, false)));
      const cols = colorsOf(p);
      if (cols.length > 1) {
        const row = el("span", "card__colors");
        cols.forEach(function (c) { const s = el("i"); s.style.background = c.swatch || "#888"; s.title = c.name; row.appendChild(s); });
        meta.appendChild(row);
      }
      b.appendChild(photo); b.appendChild(meta);
      b.addEventListener("click", function () { if (!ARRANGE) openProduct(p, b); });
      li.appendChild(b);
      grid.appendChild(li);
    });
    const label = filter === "all" || ARRANGE ? "products" : (TYPES.filter(function (t) { return t.id === filter; })[0] || {}).label.toLowerCase();
    $("shop-live").textContent = "Showing " + list.length + " " + label;
  }

  function renderChips() {
    const box = $("filters");
    box.textContent = "";
    if (ARRANGE) { box.hidden = true; return; }
    const counts = {};
    products.forEach(function (p) { const t = typeOf(p); counts[t] = (counts[t] || 0) + 1; });
    const defs = [{ id: "all", label: "All", n: products.length }];
    TYPES.forEach(function (t) { if (counts[t.id]) defs.push({ id: t.id, label: t.label, n: counts[t.id] }); });
    if (defs.length < 3) { box.hidden = true; return; }   // nothing to filter
    defs.forEach(function (d) {
      const b = el("button", "filter"); b.type = "button";
      b.dataset.type = d.id;
      b.appendChild(el("span", null, d.label));
      b.appendChild(el("span", "filter__n", String(d.n)));
      b.setAttribute("aria-pressed", String(d.id === filter));
      b.addEventListener("click", function () { setFilter(d.id); });
      box.appendChild(b);
    });
    box.hidden = false;
  }

  function setFilter(id) {
    if (id === filter) return;
    filter = id;
    Array.prototype.forEach.call($("filters").children, function (b) { b.setAttribute("aria-pressed", String(b.dataset.type === id)); });
    const grid = $("shop-grid");
    if (reduced.matches) { renderGrid(); return; }
    grid.classList.add("is-fading");
    setTimeout(function () { renderGrid(); grid.classList.remove("is-fading"); }, 170);
  }

  /* ---------- hero: best sellers card stack ---------- */
  const hero = $("shop-hero");
  const SWAP_EVERY = 3500;
  let pickList = [], pickCards = [], pickDots = [], pickIdx = 0, pickTimer = 0, pickPaused = false, pickOnScreen = true;

  function placeCards() {
    const n = pickList.length;
    pickCards.forEach(function (c, i) {
      const rel = (i - pickIdx + n) % n;
      const pos = rel === 0 ? "0" : rel === 1 ? "1" : rel === n - 1 ? "prev" : "far";
      c.dataset.pos = pos;
      c.tabIndex = pos === "0" ? 0 : -1;
      c.setAttribute("aria-hidden", pos === "0" ? "false" : "true");
    });
    pickDots.forEach(function (d, k) { if (k === pickIdx) d.setAttribute("aria-current", "true"); else d.removeAttribute("aria-current"); });
  }
  function showText() {
    const p = pickList[pickIdx];
    const name = $("pick-name"), price = $("pick-price");
    name.textContent = p.name; price.textContent = priceText(p, true);
    [name, price].forEach(function (n) { n.classList.remove("is-in"); void n.offsetWidth; n.classList.add("is-in"); });
  }
  function pickGo(i) {
    pickIdx = (i + pickList.length) % pickList.length;
    placeCards();
    showText();
  }
  function pickTick() {
    clearTimeout(pickTimer);
    if (reduced.matches || pickPaused || !pickOnScreen || document.hidden || pickList.length < 2) return;
    pickTimer = setTimeout(function () { pickGo(pickIdx + 1); pickTick(); }, SWAP_EVERY);
  }

  function skeletonPick() {
    const stage = $("pick-stage");
    stage.textContent = "";
    const sk = el("span", "pick__card is-skel");
    sk.dataset.pos = "0";
    stage.appendChild(sk);
  }
  function hidePick() {
    pickList = []; clearTimeout(pickTimer);
    $("pick").hidden = true;
    hero.classList.add("no-pick");
  }
  function renderPick() {
    const picks = FEATURED.map(function (f) {
      const slug = typeof f === "string" ? f : f.slug;
      const p = products.filter(function (x) { return x.slug === slug; })[0];
      return p ? { p: p, image: (typeof f === "object" && f.image) || 0 } : null;
    }).filter(Boolean);
    const feat = picks.map(function (k) { return k.p; });
    if (!feat.length) { hidePick(); return; }
    pickList = feat;
    const stage = $("pick-stage"), dots = $("pick-dots");
    stage.textContent = ""; dots.textContent = "";
    pickCards = feat.map(function (p) {
      const b = el("button", "pick__card"); b.type = "button";
      b.setAttribute("aria-label", "See " + p.name + ", " + priceText(p, true));
      const want = picks[feat.indexOf(p)].image;
      const first = (p.images || [])[want] || (p.images || [])[0];
      if (first) { const im = el("img"); im.alt = ""; prep(im, first.url); b.appendChild(im); }
      b.addEventListener("click", function () { openProduct(p, b); });
      stage.appendChild(b);
      return b;
    });
    pickDots = feat.length < 2 ? [] : feat.map(function (p, k) {
      const b = el("button"); b.type = "button";
      b.setAttribute("aria-label", "Show " + p.name);
      b.addEventListener("click", function () { pickGo(k); pickTick(); });
      dots.appendChild(b);
      return b;
    });
    $("pick").hidden = false;
    pickGo(0);
    pickTick();
    placeFx();
  }

  // pause while the visitor is hovering or keyboard-focused on the stack
  const pickBox = $("pick");
  if (window.matchMedia("(hover: hover)").matches) {
    pickBox.addEventListener("mouseenter", function () { pickPaused = true; pickTick(); });
    pickBox.addEventListener("mouseleave", function () { pickPaused = false; pickTick(); });
  }
  pickBox.addEventListener("focusin", function (e) { if (e.target.matches && e.target.matches(":focus-visible")) { pickPaused = true; pickTick(); } });
  pickBox.addEventListener("focusout", function () { pickPaused = false; pickTick(); });
  document.addEventListener("visibilitychange", pickTick);
  if (reduced.addEventListener) reduced.addEventListener("change", pickTick);
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (e) {
      pickOnScreen = e[0].isIntersecting;
      hero.classList.toggle("is-paused", !pickOnScreen);
      pickTick();
    }).observe(hero);
  }

  /* The spotlight effects sit behind the card: tell the CSS where the card's center is. */
  function placeFx() {
    const st = $("pick-stage");
    if (!st || $("pick").hidden) return;
    const h = hero.getBoundingClientRect(), r = st.getBoundingClientRect();
    if (!r.width) return;
    hero.style.setProperty("--fx-x", (r.left - h.left + r.width / 2).toFixed(0) + "px");
    hero.style.setProperty("--fx-y", (r.top - h.top + r.height / 2).toFixed(0) + "px");
  }
  if ("ResizeObserver" in window) new ResizeObserver(placeFx).observe(hero);
  window.addEventListener("resize", placeFx);
  window.addEventListener("load", placeFx);
  $("hero-cart").addEventListener("click", function () { openCart(false); });

  /* ---------- overlays ---------- */
  let lastFocus = null;
  function lock(on) { document.body.classList.toggle("lock", on); }
  function openCart(keepFocus) {
    if (!keepFocus) lastFocus = document.activeElement;
    renderCart();
    $("cart").hidden = false; $("overlay").hidden = false; lock(true);
    $("cart-close").focus();
  }
  function closeAll() {
    const wasOpen = !$("cart").hidden || !$("pdp").hidden;
    $("cart").hidden = true; $("pdp").hidden = true; $("overlay").hidden = true; lock(false);
    if (wasOpen && lastFocus && lastFocus.focus) lastFocus.focus();
  }
  // keeps Tab inside whichever dialog is open
  function trapTab(e) {
    if (e.key !== "Tab") return;
    const box = !$("pdp").hidden ? $("pdp") : (!$("cart").hidden ? $("cart") : null);
    if (!box) return;
    const items = Array.prototype.filter.call(
      box.querySelectorAll('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'),
      function (n) { return n.getClientRects().length > 0; }
    );
    if (!items.length) return;
    const first = items[0], last = items[items.length - 1];
    if (!box.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
    else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  /* ---------- product pop-up ---------- */
  let sel = null;
  function openProduct(p, from) {
    lastFocus = from || document.activeElement;
    const cols = colorsOf(p);
    sel = { p: p, color: cols.length ? cols[0].name : null, variant: null, img: 0 };
    autoPick();
    $("pdp-title").textContent = p.name;
    $("pdp-desc").textContent = plain(p.description);
    $("pdp-msg").textContent = "";
    const guide = $("pdp-guide");
    const t = typeOf(p);
    if (t !== "stickers" && (APPAREL[t] || hasSize(p))) { guide.href = SHOP + "/products/" + p.slug; guide.hidden = false; }
    else guide.hidden = true;
    renderPdp();
    $("pdp").hidden = false; $("overlay").hidden = true; lock(true);
    $("pdp").scrollTop = 0;
    $("pdp-close").focus();
  }
  function sizesFor() {
    return sel.p.variants.filter(function (v) { const c = colorOf(v); return !sel.color || (c && c.name === sel.color); });
  }
  function autoPick() { const o = sizesFor(); if (o.length === 1 && !hasSize(sel.p)) sel.variant = o[0]; }
  function renderPdp() {
    const p = sel.p;
    // gallery
    const imgs = imagesFor(p, sel.color);
    if (sel.img >= imgs.length) sel.img = 0;
    const main = $("pdp-main");
    if (imgs[sel.img]) { prep(main, imgs[sel.img].url); main.alt = p.name + (sel.color ? " in " + sel.color : ""); }
    const th = $("pdp-thumbs"); th.textContent = "";
    imgs.slice(0, 8).forEach(function (im, i) {
      const li = el("li"); const b = el("button"); b.type = "button"; b.setAttribute("aria-label", "Photo " + (i + 1));
      if (i === sel.img) b.setAttribute("aria-current", "true");
      const t = el("img"); t.alt = ""; t.loading = "lazy"; prep(t, im.url); b.appendChild(t);
      b.addEventListener("click", function () { sel.img = i; renderPdp(); });
      li.appendChild(b); th.appendChild(li);
    });
    // price
    $("pdp-price").textContent = sel.variant ? money(sel.variant.unitPrice.value) : priceText(p, true);
    // colors
    const cBox = $("pdp-colors"); cBox.textContent = "";
    const cols = colorsOf(p);
    if (cols.length > 1) {
      const h = el("h3", null, "Color: "); h.appendChild(el("strong", null, sel.color));
      const list = el("div", "opt-list");
      cols.forEach(function (c) {
        const b = el("button", "swatch"); b.type = "button"; b.style.background = c.swatch || "#888"; b.title = c.name; b.setAttribute("aria-label", c.name);
        b.setAttribute("aria-pressed", String(c.name === sel.color));
        const out = p.variants.filter(function (v) { const vc = colorOf(v); return vc && vc.name === c.name; }).every(soldOut);
        if (out) { b.classList.add("is-out"); b.setAttribute("aria-label", c.name + ", sold out"); }
        b.addEventListener("click", function () { sel.color = c.name; sel.variant = null; sel.img = 0; autoPick(); renderPdp(); });
        list.appendChild(b);
      });
      cBox.appendChild(h); cBox.appendChild(list);
    }
    // sizes / options
    const sBox = $("pdp-sizes"); sBox.textContent = "";
    const opts = sizesFor();
    if (opts.length > 1 || hasSize(p)) {
      const h = el("h3", null, hasSize(p) ? "Size" : "Option");
      const list = el("div", "opt-list");
      opts.forEach(function (v) {
        const b = el("button", "size", sizeLabel(v)); b.type = "button";
        b.setAttribute("aria-pressed", String(!!sel.variant && sel.variant.id === v.id));
        if (soldOut(v)) { b.disabled = true; b.title = "Sold out"; }
        b.addEventListener("click", function () { sel.variant = v; $("pdp-msg").textContent = ""; renderPdp(); });
        list.appendChild(b);
      });
      sBox.appendChild(h); sBox.appendChild(list);
    }
    // add button: disabled when there is nothing left to buy in this color
    const out = opts.length > 0 && opts.every(soldOut);
    const add = $("pdp-add");
    add.disabled = out || (!!sel.variant && soldOut(sel.variant));
    add.textContent = add.disabled ? "Sold out" : "Add to cart";
  }

  function addToCart() {
    if (!sel.variant) { $("pdp-msg").textContent = "Pick a size first."; return; }
    const v = sel.variant, p = sel.p;
    const img = (imagesFor(p, sel.color)[0] || (p.images || [])[0] || {}).url || "";
    const ex = cart.find(function (l) { return l.id === v.id; });
    if (ex) ex.qty += 1;
    else cart.push({ id: v.id, name: p.name, desc: (v.attributes && v.attributes.description) || v.name, price: v.unitPrice.value, img: img, qty: 1 });
    saveCart(); updateCount();
    $("pdp").hidden = true;
    openCart(true);
  }

  /* ---------- cart ---------- */
  function updateCount() {
    const n = cart.reduce(function (s, l) { return s + l.qty; }, 0);
    const badge = $("cart-count");
    badge.textContent = n > 99 ? "99+" : String(n);
    badge.hidden = n === 0;
    $("cart-btn").setAttribute("aria-label", n ? "Open cart, " + n + (n === 1 ? " item" : " items") : "Open cart");
  }
  function renderCart() {
    const ul = $("cart-lines"); ul.textContent = "";
    $("cart-msg").textContent = "You'll finish paying on Fourthwall's secure checkout.";
    $("cart-foot").hidden = !cart.length;
    if (!cart.length) {
      const li = el("li", "cart-empty");
      li.appendChild(el("p", null, "Your cart's empty. Go grab some Frosty gear!"));
      const keep = el("button", "pill pill--primary", "Keep shopping"); keep.type = "button";
      keep.addEventListener("click", function () { closeAll(); });
      li.appendChild(keep);
      ul.appendChild(li);
    }
    cart.forEach(function (l) {
      const li = el("li", "cart-line");
      const tb = el("div", "cart-thumb"); const im = el("img"); im.alt = ""; prep(im, l.img); tb.appendChild(im); li.appendChild(tb);
      const mid = el("div");
      mid.appendChild(el("h3", null, l.name)); mid.appendChild(el("p", null, l.desc));
      const q = el("div", "qty");
      const minus = el("button", null, "−"); minus.type = "button"; minus.setAttribute("aria-label", "One less " + l.name);
      const plus = el("button", null, "+"); plus.type = "button"; plus.setAttribute("aria-label", "One more " + l.name);
      minus.addEventListener("click", function () { l.qty -= 1; if (l.qty <= 0) cart = cart.filter(function (x) { return x !== l; }); saveCart(); updateCount(); renderCart(); });
      plus.addEventListener("click", function () { l.qty += 1; saveCart(); updateCount(); renderCart(); });
      q.appendChild(minus); q.appendChild(el("span", null, String(l.qty))); q.appendChild(plus);
      mid.appendChild(q);
      const right = el("div", "cart-line__right");
      right.appendChild(el("span", "line-price", money(l.price * l.qty)));
      const rm = el("button", "remove", "Remove"); rm.type = "button"; rm.setAttribute("aria-label", "Remove " + l.name);
      rm.addEventListener("click", function () { cart = cart.filter(function (x) { return x !== l; }); saveCart(); updateCount(); renderCart(); });
      right.appendChild(rm);
      li.appendChild(mid); li.appendChild(right);
      ul.appendChild(li);
    });
    $("cart-total").textContent = money(cart.reduce(function (n, l) { return n + l.price * l.qty; }, 0));
    $("checkout").disabled = !cart.length;
  }

  async function checkout() {
    if (!cart.length) return;
    const btn = $("checkout"), msg = $("cart-msg");
    btn.disabled = true; msg.textContent = "Taking you to checkout...";
    try {
      const c = await fetch(API + "/carts?storefront_token=" + TOKEN, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ items: [] }) });
      if (!c.ok) throw new Error("cart");
      const id = (await c.json()).id;
      const a = await fetch(API + "/carts/" + id + "/add?storefront_token=" + TOKEN, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart.map(function (l) { return { variantId: l.id, quantity: l.qty }; }) })
      });
      if (!a.ok) throw new Error("add");
      window.location.href = SHOP + "/checkout/?cartCurrency=" + CUR + "&cartId=" + encodeURIComponent(id);
    } catch (e) {
      btn.disabled = false;
      msg.textContent = "Couldn't start checkout. Please try again, or shop on the Fourthwall store instead.";
    }
  }

  /* ---------- arrange mode (only for you: add ?arrange to the address) ---------- */
  function startArrange() {
    const grid = $("shop-grid");
    document.body.classList.add("arranging");
    const bar = el("div", "arrange-bar");
    bar.appendChild(el("p", null, "Arrange mode: drag the products into the order you want. Nobody else sees this."));
    const ta = el("textarea"); ta.readOnly = true; ta.rows = 3; ta.setAttribute("aria-label", "Your product order");
    const copy = el("button", "pill pill--outline pill--sm", "Copy my order"); copy.type = "button";
    bar.appendChild(ta); bar.appendChild(copy);
    grid.parentNode.insertBefore(bar, grid);
    function order() { return Array.prototype.map.call(grid.children, function (li) { return li.dataset.slug; }); }
    function show() { ta.value = order().join("\n"); }
    show();
    copy.addEventListener("click", function () {
      ta.select();
      try { navigator.clipboard.writeText(ta.value); copy.textContent = "Copied! Paste it to Claude"; } catch (e) { document.execCommand("copy"); copy.textContent = "Copied! Paste it to Claude"; }
    });
    let drag = null;
    Array.prototype.forEach.call(grid.children, function (li) {
      li.draggable = true;
      li.addEventListener("dragstart", function (e) { drag = li; li.classList.add("dragging"); e.dataTransfer.effectAllowed = "move"; try { e.dataTransfer.setData("text/plain", li.dataset.slug); } catch (x) {} });
      li.addEventListener("dragend", function () { li.classList.remove("dragging"); drag = null; show(); });
      li.addEventListener("dragover", function (e) {
        e.preventDefault();
        if (!drag || drag === li) return;
        const r = li.getBoundingClientRect();
        const after = (e.clientX - r.left) > r.width / 2 && Math.abs(e.clientY - (r.top + r.height / 2)) < r.height / 2;
        const below = e.clientY > r.top + r.height / 2 && !after;
        grid.insertBefore(drag, (after || below) ? li.nextSibling : li);
      });
    });
  }

  /* ---------- wire up ---------- */
  $("cart-btn").addEventListener("click", function () { openCart(false); });
  $("cart-close").addEventListener("click", closeAll);
  $("overlay").addEventListener("click", closeAll);
  $("pdp-close").addEventListener("click", closeAll);
  $("pdp").addEventListener("click", function (e) { if (e.target === $("pdp")) closeAll(); });
  $("pdp-add").addEventListener("click", addToCart);
  $("checkout").addEventListener("click", checkout);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeAll(); else trapTab(e); });
  updateCount();

  if (location.protocol === "file:") {
    hidePick();
    showStatus("The merch loads when the site is online. Open the live site to see it.", false);
    return;
  }
  skeletonGrid();
  skeletonPick();
  fetchAll().then(function (list) {
    products = list;
    if (ORDER.length) products.sort(function (a, b) { const ia = ORDER.indexOf(a.slug), ib = ORDER.indexOf(b.slug); return (ia < 0 ? 999 : ia) - (ib < 0 ? 999 : ib); });
    if (!products.length) { $("shop-grid").textContent = ""; hidePick(); showStatus("New merch is coming soon.", false); return; }
    showStatus("", false);
    renderChips();
    renderGrid();
    renderPick();
    if (ARRANGE) startArrange();
  }).catch(function () {
    $("shop-grid").textContent = "";
    hidePick();
    $("shop-live").textContent = "";
    showStatus("Couldn't load the merch right now. The tide must be out. You can shop everything on Fourthwall instead.", true);
  });
})();

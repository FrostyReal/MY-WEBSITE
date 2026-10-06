/* =====================================================================
   MERCH PAGE: pulls your products live from Fourthwall.
   The token below is Fourthwall's PUBLIC storefront token (made to be used on websites).
   ===================================================================== */
(function merch() {
  const TOKEN = "ptkn_f1befabb-7502-4c1a-8482-1ea6ef1f4926";
  const API = "https://storefront-api.fourthwall.com/v1";
  const SHOP = "https://frostyrealkick-shop.fourthwall.com";
  const CUR = "USD";

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
  const ARRANGE = /[?&]arrange\b/.test(location.search);

  const $ = function (id) { return document.getElementById(id); };
  const money = function (v) { return "$" + Number(v).toFixed(2); };
  const el = function (tag, cls, text) { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };

  let products = [];
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem("fr_cart") || "[]"); } catch (e) { cart = []; }
  function saveCart() { try { localStorage.setItem("fr_cart", JSON.stringify(cart)); } catch (e) {} }

  /* ---------- helpers for variants ---------- */
  const colorOf = function (v) { return v.attributes && v.attributes.color ? v.attributes.color : null; };
  const sizeLabel = function (v) { const a = v.attributes || {}; return (a.size && a.size.name) || a.description || v.name; };
  const hasSize = function (p) { return p.variants.some(function (v) { return v.attributes && v.attributes.size; }); };
  const soldOut = function (v) { return !!(v.stock && v.stock.inStock === 0); };
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
  function plain(html) { const d = document.createElement("div"); d.innerHTML = (html || "").replace(/<\/p>|<br\s*\/?>|<\/li>/gi, "\n"); return (d.textContent || "").trim(); }


  /* Evens out the photo backgrounds: some photos have a light-gray backdrop, some are see-through.
     We measure the corners and brighten the gray ones so every card looks the same. */
  function prep(img, url) {
    img.crossOrigin = "anonymous";
    img.addEventListener("load", function () {
      try {
        const c = document.createElement("canvas"); c.width = 40; c.height = 40;
        const x = c.getContext("2d"); x.drawImage(img, 0, 0, 40, 40);
        let r = 0, g = 0, b = 0, n = 0;
        [[0, 0], [35, 0], [0, 35], [35, 35]].forEach(function (p) {
          const d = x.getImageData(p[0], p[1], 5, 5).data;
          for (let i = 0; i < d.length; i += 4) { r += d[i]; g += d[i + 1]; b += d[i + 2]; n++; }
        });
        const lum = 0.299 * r / n + 0.587 * g / n + 0.114 * b / n;
        if (lum > 150 && lum < 252) img.style.filter = "brightness(" + Math.max(0.85, Math.min(1.4, 229 / lum)).toFixed(3) + ")";
      } catch (e) { /* ignore: photo stays as it is */ }
    });
    img.src = url;
  }

  /* ---------- load + show products ---------- */
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

  function renderGrid() {
    const grid = $("shop-grid");
    grid.textContent = "";
    products.forEach(function (p) {
      const li = el("li"); li.dataset.slug = p.slug;
      const b = el("button", "shop-card");
      b.type = "button";
      const imgBox = el("div", "shop-img");
      const first = (p.images || [])[0];
      if (first) { const im = el("img"); im.alt = p.name; im.loading = "lazy"; prep(im, first.url); imgBox.appendChild(im); }
      const meta = el("div", "shop-meta");
      meta.appendChild(el("p", "shop-name", p.name));
      const lo = minPrice(p), hi = maxPrice(p);
      meta.appendChild(el("p", "shop-price", lo === hi ? money(lo) : "From " + money(lo)));
      const cols = colorsOf(p);
      if (cols.length > 1) {
        const row = el("div", "shop-colors");
        cols.forEach(function (c) { const s = el("span"); s.style.background = c.swatch || "#888"; s.title = c.name; row.appendChild(s); });
        meta.appendChild(row);
      }
      b.appendChild(imgBox); b.appendChild(meta);
      b.addEventListener("click", function () { if (!ARRANGE) openProduct(p, b); });
      li.appendChild(b);
      grid.appendChild(li);
    });
  }

  /* ---------- overlays ---------- */
  let lastFocus = null;
  function lock(on) { document.body.classList.toggle("lock", on); }
  function openCart() {
    lastFocus = document.activeElement;
    renderCart();
    $("cart").hidden = false; $("overlay").hidden = false; lock(true);
    $("cart-close").focus();
  }
  function closeAll() {
    $("cart").hidden = true; $("pdp").hidden = true; $("overlay").hidden = true; lock(false);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  /* ---------- product pop-up ---------- */
  let sel = null;
  function openProduct(p, from) {
    lastFocus = from || document.activeElement;
    const cols = colorsOf(p);
    sel = { p: p, color: cols.length ? cols[0].name : null, variant: null, img: 0 };
    const sizes = sizesFor();
    if (sizes.length === 1 && !hasSize(p)) sel.variant = sizes[0];
    $("pdp-title").textContent = p.name;
    $("pdp-desc").textContent = plain(p.description);
    $("pdp-msg").textContent = "";
    renderPdp();
    $("pdp").hidden = false; $("overlay").hidden = true; lock(true);
    $("pdp-close").focus();
  }
  function sizesFor() {
    return sel.p.variants.filter(function (v) { const c = colorOf(v); return !sel.color || (c && c.name === sel.color); });
  }
  function renderPdp() {
    const p = sel.p;
    // gallery
    const imgs = imagesFor(p, sel.color);
    if (sel.img >= imgs.length) sel.img = 0;
    const main = $("pdp-main");
    main.style.filter = ""; if (imgs[sel.img]) { prep(main, imgs[sel.img].url); main.alt = p.name + (sel.color ? " in " + sel.color : ""); }
    const th = $("pdp-thumbs"); th.textContent = "";
    imgs.slice(0, 8).forEach(function (im, i) {
      const li = el("li"); const b = el("button"); b.type = "button"; b.setAttribute("aria-label", "Photo " + (i + 1));
      if (i === sel.img) b.setAttribute("aria-current", "true");
      const t = el("img"); t.alt = ""; t.loading = "lazy"; prep(t, im.url); b.appendChild(t);
      b.addEventListener("click", function () { sel.img = i; renderPdp(); });
      li.appendChild(b); th.appendChild(li);
    });
    // price
    const shown = sel.variant ? sel.variant.unitPrice.value : null;
    $("pdp-price").textContent = shown != null ? money(shown) : (minPrice(p) === maxPrice(p) ? money(minPrice(p)) : "From " + money(minPrice(p)));
    // colors
    const cBox = $("pdp-colors"); cBox.textContent = "";
    const cols = colorsOf(p);
    if (cols.length > 1) {
      const h = el("h3", null, "Color: "); h.appendChild(el("strong", null, sel.color));
      const list = el("div", "opt-list");
      cols.forEach(function (c) {
        const b = el("button", "swatch"); b.type = "button"; b.style.background = c.swatch || "#888"; b.title = c.name; b.setAttribute("aria-label", c.name);
        b.setAttribute("aria-pressed", String(c.name === sel.color));
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
        const b = el("button", "chip", sizeLabel(v)); b.type = "button";
        b.setAttribute("aria-pressed", String(!!sel.variant && sel.variant.id === v.id));
        if (soldOut(v)) b.disabled = true;
        b.addEventListener("click", function () { sel.variant = v; $("pdp-msg").textContent = ""; renderPdp(); });
        list.appendChild(b);
      });
      sBox.appendChild(h); sBox.appendChild(list);
    }
    $("pdp-add").disabled = false;
  }
  function autoPick() { const o = sizesFor(); if (o.length === 1 && !hasSize(sel.p)) sel.variant = o[0]; }

  function addToCart() {
    if (!sel.variant) { $("pdp-msg").textContent = "Pick a size first."; return; }
    const v = sel.variant, p = sel.p;
    const img = (imagesFor(p, sel.color)[0] || (p.images || [])[0] || {}).url || "";
    const ex = cart.find(function (l) { return l.id === v.id; });
    if (ex) ex.qty += 1;
    else cart.push({ id: v.id, name: p.name, desc: (v.attributes && v.attributes.description) || v.name, price: v.unitPrice.value, img: img, qty: 1 });
    saveCart(); updateCount();
    $("pdp").hidden = true; openCart();
  }

  /* ---------- cart ---------- */
  function updateCount() { $("cart-count").textContent = cart.reduce(function (n, l) { return n + l.qty; }, 0); }
  function renderCart() {
    const ul = $("cart-lines"); ul.textContent = "";
    $("cart-msg").textContent = "";
    if (!cart.length) { ul.appendChild(el("li", "cart-empty", "Your cart is empty.")); }
    cart.forEach(function (l) {
      const li = el("li", "cart-line");
      const tb = el("div", "cart-thumb"); const im = el("img"); im.alt = ""; prep(im, l.img); tb.appendChild(im); li.appendChild(tb);
      const mid = el("div");
      mid.appendChild(el("h3", null, l.name)); mid.appendChild(el("p", null, l.desc));
      const q = el("div", "qty");
      const minus = el("button", null, "−"); minus.type = "button"; minus.setAttribute("aria-label", "One less");
      const plus = el("button", null, "+"); plus.type = "button"; plus.setAttribute("aria-label", "One more");
      minus.addEventListener("click", function () { l.qty -= 1; if (l.qty <= 0) cart = cart.filter(function (x) { return x !== l; }); saveCart(); updateCount(); renderCart(); });
      plus.addEventListener("click", function () { l.qty += 1; saveCart(); updateCount(); renderCart(); });
      q.appendChild(minus); q.appendChild(el("span", null, String(l.qty))); q.appendChild(plus);
      mid.appendChild(q);
      const right = el("div");
      right.appendChild(el("span", "line-price", money(l.price * l.qty)));
      const rm = el("button", "remove", "Remove"); rm.type = "button";
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
    const copy = el("button", "btn btn-small", "Copy my order"); copy.type = "button";
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
  $("cart-btn").addEventListener("click", openCart);
  $("cart-close").addEventListener("click", closeAll);
  $("overlay").addEventListener("click", closeAll);
  $("pdp-close").addEventListener("click", closeAll);
  $("pdp").addEventListener("click", function (e) { if (e.target === $("pdp")) closeAll(); });
  $("pdp-add").addEventListener("click", addToCart);
  $("checkout").addEventListener("click", checkout);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeAll(); });
  updateCount();

  if (location.protocol === "file:") {
    $("shop-status").textContent = "The merch loads when the site is online. Open the live site to see it.";
    return;
  }
  fetchAll().then(function (list) {
    products = list;
    if (ORDER.length) products.sort(function (a, b) { const ia = ORDER.indexOf(a.slug), ib = ORDER.indexOf(b.slug); return (ia < 0 ? 999 : ia) - (ib < 0 ? 999 : ib); });
    if (!products.length) { $("shop-status").textContent = "New merch is coming soon."; return; }
    $("shop-status").textContent = "";
    renderGrid();
    if (ARRANGE) startArrange();
  }).catch(function () {
    $("shop-status").textContent = "Couldn't load the merch right now. You can shop the full store on Fourthwall below.";
  });
})();

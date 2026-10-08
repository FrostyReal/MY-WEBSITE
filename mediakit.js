/* ===================================================================== */
/* THINGS YOU CAN EDIT (no coding needed, just change the text in quotes)

   Everything numbers-related on the media kit comes from the KIT block below.
   Any section with nothing in it (performance, age, gender, countries) stays hidden,
   so only add numbers you have real proof for.
   Performance numbers are grouped on the page by platform (a line that mentions YouTube goes under YouTube,
   one that mentions Kick or the stream goes under Kick). Text in brackets, like (last 30 days), shows smaller under the label.
   The age and country bars are drawn relative to the biggest number in the list.

   updated     = the date you read the follower numbers
   followers   = one line per platform: name, count, and a short note (leave "" for no note)
   partnerBadge = the picture file of the official Sea of Thieves Partner badge, for example
                  "images/sot-partner.png". Leave it as null to hide the badge.
   performance = big numbers for brands. Example line:
                  { label: "Avg views per YouTube video", value: "12K" }
   audience    = who watches. Percent numbers only. Example lines:
                  ages:      [{ label: "18–24", pct: 42 }]
                  genders:   [{ label: "Male", pct: 80 }, { label: "Female", pct: 20 }]
                  countries: [{ label: "United States", pct: 55 }]
                  source:    one line saying where the audience numbers come from        */
const KIT = {
  updated: "October 1–7, 2026",
  followers: [
    { platform: "TikTok", count: "18.4K", note: "418.1K total likes" },
    { platform: "YouTube", count: "13.6K", note: "Long videos and Shorts" },
    { platform: "Kick", count: "5.3K", note: "Verified channel. Live Mon, Wed and Fri at 5 PM Eastern" },
    { platform: "Instagram", count: "3.3K", note: "" }
  ],
  partnerBadge: "images/sot-partner.webp",
  performance: [   // YouTube numbers from YouTube Studio (October 2026); Kick numbers from Kick's official media kit, snapshot October 7, 2026
    { label: "Avg views per YouTube video (latest 4 videos)", value: "41K" },
    { label: "Views on my biggest YouTube video", value: "530K" },
    { label: "Avg views per YouTube Short (Jul–Aug 2026)", value: "11.8K" },
    { label: "Avg live viewers on Kick (last 30 days)", value: "69" },
    { label: "Peak live viewers on Kick (last 90 days)", value: "130" },
    { label: "Unique Kick viewers (last 90 days)", value: "2.7K" },
    { label: "Chat messages per minute on stream", value: "9.8" }
  ],
  audience: {   // from YouTube Studio > Analytics > Audience, views in the last 28 days (October 2026)
    source: "Audience numbers from YouTube Analytics, share of views in the last 28 days.",
    ages: [
      { label: "13–17", pct: 13.9 }, { label: "18–24", pct: 25.2 }, { label: "25–34", pct: 42.6 },
      { label: "35–44", pct: 11.8 }, { label: "45–54", pct: 5.1 }, { label: "55–64", pct: 1.1 }, { label: "65+", pct: 0.3 }
    ],
    genders: [ { label: "Male", pct: 97.4 }, { label: "Female", pct: 2.5 } ],
    countries: [
      { label: "United States", pct: 33.9 }, { label: "United Kingdom", pct: 8.1 }, { label: "Germany", pct: 4.5 },
      { label: "Brazil", pct: 4.4 }, { label: "Canada", pct: 3.5 }
    ]
  }
};
/* ===================================================================== */

/* Build the data-driven sections */
(function kitData() {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  // partner badge
  const badge = document.getElementById("partner-badge");
  if (badge && KIT.partnerBadge) { badge.src = KIT.partnerBadge; badge.hidden = false; }

  // followers
  const fl = document.getElementById("followers");
  if (fl) {
    KIT.followers.forEach(function (f) {
      const li = el("li", "follower");
      li.appendChild(el("span", "follower__name", f.platform));
      li.appendChild(el("span", "follower__count", f.count));
      if (f.note) li.appendChild(el("span", "follower__note", f.note));
      fl.appendChild(li);
    });
  }
  const note = document.getElementById("kit-note");
  if (note) note.textContent = "Numbers were read from each platform on " + KIT.updated + ".";

  // performance: grouped by platform (a label that mentions Kick or "stream" goes under Kick, YouTube under YouTube)
  const perfSec = document.getElementById("performance");
  const perf = document.getElementById("perf-list");
  if (perfSec && perf && KIT.performance && KIT.performance.length) {
    const groups = [];
    function groupFor(name) {
      for (let i = 0; i < groups.length; i++) if (groups[i].name === name) return groups[i];
      const g = { name: name, items: [] };
      groups.push(g);
      return g;
    }
    KIT.performance.forEach(function (p) {
      const t = String(p.label).toLowerCase();
      groupFor(t.indexOf("youtube") > -1 ? "YouTube" : (t.indexOf("kick") > -1 || t.indexOf("stream") > -1) ? "Kick" : "More").items.push(p);
    });
    groups.forEach(function (g) {
      const wrap = el("div", "perf__group");
      const head = el("div", "perf__head");
      head.appendChild(el("h3", null, g.name));
      const grid = el("ul", "perf__grid");
      g.items.forEach(function (p) {
        const li = el("li", "panel perf__item");
        li.appendChild(el("span", "perf__value", p.value));
        const m = /^(.*?)\s*\((.*)\)\s*$/.exec(p.label);   // "Label (detail)" shows the detail in smaller text
        const lab = el("span", "perf__label", m ? m[1] : p.label);
        if (m) lab.appendChild(el("span", "perf__sub", m[2]));
        li.appendChild(lab);
        grid.appendChild(li);
      });
      wrap.appendChild(head);
      wrap.appendChild(grid);
      perf.appendChild(wrap);
    });
    perfSec.hidden = false;
  }

  // audience bars: each bar is a share of the LARGEST value in its list (the biggest fills the whole track)
  function bars(listId, items) {
    const ul = document.getElementById(listId);
    if (!ul) return;
    const max = Math.max.apply(null, items.map(function (it) { return it.pct; })) || 1;
    items.forEach(function (it) {
      const li = el("li", "bar");
      const head = el("div", "bar__head");
      head.appendChild(el("span", "bar__label", it.label));
      head.appendChild(el("span", "bar__pct", it.pct + "%"));
      const track = el("div", "bar__track");
      const fill = el("i", "bar__fill");
      fill.style.width = Math.max(1, Math.min(100, it.pct / max * 100)).toFixed(1) + "%";
      track.appendChild(fill);
      li.appendChild(head);
      li.appendChild(track);
      ul.appendChild(li);
    });
  }
  const A = KIT.audience || {};
  const demo = document.getElementById("demo");
  let any = false;
  if (A.ages && A.ages.length) {
    bars("bars-ages", A.ages);
    document.getElementById("demo-ages").hidden = false;
    any = true;
  }
  if (A.countries && A.countries.length) {
    bars("bars-countries", A.countries);
    document.getElementById("demo-countries").hidden = false;
    any = true;
  }
  if (A.genders && A.genders.length) {
    const split = document.getElementById("split-genders");
    const key = document.getElementById("key-genders");
    split.setAttribute("aria-label", A.genders.map(function (g) { return g.label + " " + g.pct + "%"; }).join(", "));
    A.genders.forEach(function (g, i) {
      const seg = el("i", "split__seg" + (i === 0 ? " is-first" : ""));
      seg.style.width = g.pct + "%";   // genders already add up to about 100, so the bar is the real split
      split.appendChild(seg);
      const li = el("li", null);
      li.appendChild(el("strong", "gender__pct", g.pct + "%"));
      const lab = el("span", "gender__label");
      lab.appendChild(el("i", "gender__dot" + (i === 0 ? " is-first" : "")));
      lab.appendChild(document.createTextNode(g.label));
      li.appendChild(lab);
      key.appendChild(li);
    });
    document.getElementById("demo-genders").hidden = false;
    any = true;
  }
  if (demo && any) demo.hidden = false;
  const src = document.getElementById("demo-source");
  if (src && any && A.source) { src.textContent = A.source + " Bars are scaled to the biggest number in each list."; src.hidden = false; }

  // bars are drawn at full width straight away (no grow-in: an empty bar could never be "seen" to start it)
})();

/* Save as PDF buttons */
(function printButtons() {
  document.querySelectorAll("[data-print]").forEach(function (b) {
    b.addEventListener("click", function () { window.print(); });
  });
})();

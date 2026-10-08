# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Hard rules

- Never commit or push to GitHub. That's the user's job unless they explicitly ask.
- If a required tool, skill or file isn't available, say so instead of proceeding without it.
- Never use a model above Opus without asking first.
- The user is not a programmer. Explain changes in plain language, and keep the "THINGS YOU CAN EDIT"
  style comments in the JS files working so they can update content without touching code.
- Keep the "Design system" and "Brand guidelines" sections of this file up to date. Whenever a
  styling rule, color, font, layout pattern or brand decision is added or changed (including in a
  mockup the user approves), update this file in the same piece of work.

## What this is

Personal website for FrostyReal, a Sea of Thieves content creator (Kick, YouTube, TikTok).
GitHub repo: `FrostyReal/MY-WEBSITE`.

Hosted on GitHub Pages with the custom domain **frostyreal.com** (added 2026-10-08; the `CNAME` file
contains it). Don't add, edit or delete `CNAME`, and don't change GitHub Pages settings, without asking.
Each page has `og:url` + `<link rel="canonical">` with its full https://frostyreal.com address, and
`robots.txt` + `sitemap.xml` list the four pages (add new pages to the sitemap).

The site has four jobs, all equally important:
1. Win brand sponsorships (media kit, partner sections).
2. Sell merch (Fourthwall shop).
3. Grow followers on Kick, YouTube and TikTok.
4. Promote the Ultimate Pirate Championship (UPC) events.

Visitors come on phones and desktop about equally. Design and test for both, neither is secondary.

Plain static site: hand-written HTML, CSS and vanilla JS. No framework, no package.json, no build
step, no tests. Don't add a build tool, framework or npm dependency without asking.

To preview, serve the folder over HTTP (for example `python -m http.server`). Opening the files
straight from disk (`file://`) works, but the YouTube/Kick players and the merch shop deliberately
switch to fallback buttons/messages in that mode, so they can't be checked that way.

## Pages and files

| Page | CSS | JS | Notes |
|------|-----|----|-------|
| `index.html` | `home.css` + `sea.css` | `home.js` + `sea.js` | Home, **"Night sea" design** (went live 2026-10-07): hero sea scene, Watch, Live on Kick, Merch band, UPC band, Work with me teaser (Goody's + media kit link). |
| `upc.html` | `upc.css` | `upc.js` | Ultimate Pirate Championship, **"Fight Night" design** (went live 2026-10-07). **Separate brand**. Events, modes and links live in the "THINGS YOU CAN EDIT" block of `upc.js` |
| `media-kit.html` | `home.css` + `sea.css` + `mediakit.css` | `home.js` + `sea.js` + `mediakit.js` | For brands, **Night sea "pitch deck"** (hero reuses the home sea scene, no emotes, body has `data-sea-life="calm"`) (2026-10-07). Data (followers, performance, audience, partner badge) lives in the `KIT` block of `mediakit.js`; sections with empty data stay hidden. Print/PDF styles in `mediakit.css` (`@media print`) |
| `merch.html` | `home.css` + `sea.css` + `merch.css` | `home.js` + `sea.js` + `merch.js` | Live Fourthwall shop (reworked 2026-10-08): hero reuses the home sea scene with a frost spotlight (no logo pattern: the user disliked it there) and a cycling `FEATURED` product stack showing the back-print photos, filter chips, product popup with size-guide link, slide-out cart, header cart button. Body has `data-sea-life="calm"` |

- Every live page loads the shared `home.css` + `home.js` (header, footer, snow, `.deep` background
  with contours and sea life) plus its own CSS/JS. `home.js` features return early when their
  elements are missing; the home hero uses `.hero`, other pages use their own hero class.
- `404.html` is the custom "Lost at sea" page (GitHub Pages serves it for missing URLs). It uses root-relative links (`/index.html`, `/home.css`...) on purpose, since it can load from any path depth. Loads `home.css` + `sea.css`, `home.js` + `sea.js`.
- Every page has a "Skip to content" link (`.skip-link` in `home.css`, targets `<main id="top" tabindex="-1">`). On phones (<=480px) the six header tabs are shrunk to fit one row at 375px; below 340px they scroll with a soft right-edge fade.
- The old design's `style.css`, `script.js` and `mockup-watch.html` were deleted 2026-10-08 (still in
  git history).
- In every JS file, each feature is a self-invoking function that returns early if its elements
  aren't on the page; keep that pattern.
- The header nav and footer are copy-pasted into every page. A nav/footer change must be made in
  all of them (`upc.html` has its own variant). The old pages' nav already points at the new home
  sections (`#top`, `#watch`, `#live`, `#partners`).
- Link previews (when the site is shared): home, media kit and merch use `images/og-frostyreal.jpg`
  (1200x630, the night-sea scene with logo and name, made 2026-10-08 by screenshotting a temporary
  page built from the home hero with headless Chrome). UPC uses `images/upc-og.jpg`. Both use full `https://frostyreal.com/...` URLs (some apps need them).
- Images live in `images/`. Check that an image is actually referenced before assuming it's in use.
  Not used by any page: `Frosty2.png` (3.9 MB), `goodys-bag.jpg`, `upc-poster.jpg`, `upc-logo.jpg`,
  `banner.jpg` (old share image), `snowman-cool.png`
  and `snowman-hype.png` may be unused too now (check before assuming). The user is
  keeping these for later: never delete them. Compress
  `Frosty2.png` before putting it on a page.

## Design system

- Main brand tokens for the new design are in `:root` at the top of `home.css` (`--sky`, `--sea`,
  `--abyss`, `--frost`, `--frost-dim`, `--ice`, `--mist`, `--rim`, `--glass`, `--display`, `--body`,
  `--r-media`). All FrostyReal pages reuse them (the old `style.css` names are listed in the Colors
  table only for reference). Use these variables instead of new hex values.
- `upc.css` has its own `:root` palette (`--ink`, `--teal`, `--red`, `--stone`...). Don't mix the
  two brands.
- Fonts come from Google Fonts `<link>` tags in each page's `<head>`.
- Breakpoints in use: 1100px, 820px, 760px, 480px.
- Motion (falling snow, scroll reveal, count-up numbers, card tilt) must respect
  `prefers-reduced-motion`, and tilt only runs on hover-capable devices. Keep that for anything new.
- Accessibility is already taken seriously: `alt=""` on decorative images, `aria-live` on dynamic
  text, focus returned when dialogs close. Don't regress it.
- The snow canvas (`#snow`) sits **behind** page content (`z-index: -1`; the background glow layers
  are `-2`). Never put it back on top of content.

## Brand guidelines

Applies to the main FrostyReal brand (not UPC).

**Brand core (what makes it FrostyReal):** the white snowman logo (backwards cap, round glasses,
`images/logo-white.png`), frost blue on night-navy, the snowman emotes (`images/emote-*.png`), and a
Sea of Thieves / night-ocean flavor. Tagline: "Just a goldfish in the ocean". Always keep the falling
snow, the logo, and the top nav tabs (Home, Watch/Videos, Live, Partners, Media kit, Merch, plus
Subscribe button and the UPC tab).

**Colors** (tokens in `home.css`; old `style.css` names for reference):

| Role | Hex | style.css (old) | home.css (new) |
|------|-----|-----------|--------|
| Darkest background | `#02070d` | `--night` | `--abyss` |
| Dark panel background | `#06121d` | `--night-2` | `--sea` |
| Deep navy | `#0a2236` | `--deep` | `--sky` |
| Accent (the only accent color) | `#00a7f5` | `--frost-bright` | `--frost` |
| Accent hover | `#0098e0` | `--frost` | `--frost-dim` |
| Main text | `#eef6fb` | `--ice` | `--ice` |
| Secondary text | `#8fa8ba` | `--mute` | `--mist` |
| Thin borders | `rgba(238,246,251,.12)` | `--line` | `--rim` |
| Panel fill | `rgba(238,246,251,.04)` | none | `--glass` |

No warm colors in the main brand. Tints and alpha versions of the colors above are fine.

**Type:** Barlow Condensed (700/800) for headings and big numbers, Barlow (400/500/600) for body.
Sentence case everywhere. Avoid: ALL-CAPS tracked labels above headings, "A · B · C" meta strings,
"→" arrows in button/link text, monospace labels, and coloring a single word in a headline.

### "Night sea" direction (the live home page, `index.html`; the style for all FrostyReal pages)

The user picked this direction to fix "too much decoration" and "doesn't feel like one brand".
- **Calm and streamlined:** no aurora glow, wavy hill dividers, snowman section dividers or card
  tilt. Spend the boldness in one place: the hero.
- **Hero = full-screen night sea scene (100vh / 100svh):** stars, glowing moon with drifting
  clouds, moon reflection glittering on the water, **calm** low rolling waves (the user prefers calm
  seas: small amplitude, long swells, slow scroll), **two islands** to fill the space (a far island
  out in the open water toward the moon, NOT under the hero buttons, clearly out of the water with palms, and a big near
  island in the bottom-left foreground with palms, rocks and a barrel, kept **big** (the user
  noticed when it shrank), whose right tip fades softly into the waves with no hard edge), a **detailed Sea of Thieves
  sloop** (curved planked hull, stern castle with lantern, billowing square sail plus topsail,
  rigging, bowsprit, pennant, no stray jib triangle) that **sails toward the viewer between the
  islands**, growing as it comes closer, then fades and repeats, and seagulls that fly across now and
  then (random intervals, never constantly). The scene sits at `z-index: -2` so the snow
  (`-1`) falls over it and behind the text. The nav is fixed and transparent over the hero, and turns
  solid after scrolling.
- **Page background** darkens with depth as you scroll: `--sky` to `--sea` to `--abyss`. It must
  not feel blank: a fixed "going deeper" layer (`.deep`, `z-index: -3`, behind the hero scene and
  snow) with faint nautical-chart depth contours plus depth numbers, soft frost light pools, gentle
  parallax on scroll, and faint sea-life silhouettes passing by now and then below the hero (whale,
  a school of fish, shark, sea turtle, rising jellyfish). The user wants it **lively**: a new one
  every few seconds, up to about 5 on screen, fish schools most common and fairly big. Contour
  clusters are scattered **randomly** (seeded, varied sizes and gaps), never a repeating left/right
  pattern, and **plenty of them** (small, medium and large, on both sides, all the way down).
  Clusters never overlap each other, never line up in columns, and no large ones sit right below
  the hero. Creatures always face the way they're moving (no swimming backwards).
- **Personality = one snowman emote "reaction sticker" per section**, next to the h2, slightly
  rotated: `emote-hype` at Watch, `emote-chest` (the Athena chest snowman) at Live on Kick,
  `emote-winna` (crown) at Merch, `emote-shades` at Partners. Don't use the chest one for merch. It wiggles on hover
  only on hover-capable devices.
- **Shapes:** only two radii: `--r-media` 14px (videos, images, panels) and pills (999px) for
  buttons/chips. Thin `--rim` borders, `--glass` fills. No drop shadows except the frost glow on
  primary buttons. Primary button = frost fill with dark navy text; secondary = outline pill.
- **Layout:** left-aligned, max width 1160px, side padding `clamp(16px, 4vw, 40px)`. Section
  vertical padding `clamp(48px, 7.3vw, 94px)` (the user found bigger gaps between sections too far).
- **UPC tab colors flow across the whole pill** (teal, steel blend in the middle, red); no dark hole
  in the middle. Use the deeper UPC colors (`#0a8f6c` → dark blend → `#a8121b`) at moderate
  opacity: vibrant but not bright, neon or washed out.
- **Section order:** Hero, Watch, Live, Merch band, UPC band, Work with me teaser (Goody's +
  media kit link), Footer.
- **Nav:** small vertical dividers before "Media kit" and before "Merch" (they're separate
  destinations), like the live site.
- **Watch section = long-form only.** No Shorts on the website (the user decided visitors don't
  watch Shorts on a site; they live on TikTok/YouTube Shorts). Layout: featured video with title and
  "Watch it here" / "Open on YouTube" buttons, then a 4-video grid, then one quiet line: "Into
  Shorts? Catch them on TikTok, YouTube Shorts, and Instagram." (all three are links). Keep it streamlined: no carousels, switchers or mixed grids.
- **Merch band copy:** heading "Merch Is Here", line "Get your own Frosty Merch from hoodies, to
  stickers, to crop tops!" (user's exact wording). Instead of an emote, the band cycles real products
  (Wavy Tee back print, Drip Cropped Hoodie, Hat) on light "product cards", loaded live from the
  Fourthwall Storefront API by slug (`MERCH_SHOWCASE` in `home.js`), falling back to
  `emote-winna.png`. Product photos have light backgrounds, so always show them on light cards.
  The band's background is "flashy" but stays FrostyReal (frost blue only): a rotating frost
  spotlight behind the products, a faint drifting snowman-logo pattern, rising sparkles and a
  periodic shine sweep. The text block (heading, line, button) is centered within the left side,
  center-aligned, with **big** type (heading up to ~4.6rem) so it fills the space. On desktop: a larger product stack anchored toward the right
  edge with a little breathing room (the next card peeks out behind), and the spotlight follows it.
  Centering it in the right half left too much empty space.
- **UPC band (exception to the brand-mixing rule):** the home page's UPC band uses UPC's own art and
  colors (`upc-bg.jpg` with the teal and red sigils, drifting smoke, center seam, embers, wordmark, and
  a UPC-style teal button) as a continuous gentle animation, like a mini UPC hero. The header's UPC
  tab gets a tiny version of the same effect (teal glow on the left **softly fading** into red on
  the right, never a hard green/red split, plus rising embers inside the pill). The merch band and
  UPC band are the same height on desktop. Keep the UPC look contained to those two spots.
- **Video players** are click-to-load facades (thumbnail plus play button, then the iframe on
  click). Long-video thumbnails use `mqdefault` (16:9, no black bars).
- **Motion:** one page-load moment (hero intro) plus the ambient sea. Everything goes still under
  `prefers-reduced-motion`, and no seagulls spawn then.

### Media kit and merch pages (reworked 2026-10-08 after user feedback)
- **Both** reuse the home page's real hero scene (`sea.css` + `sea.js` + the `.scene` markup), each
  with page-scoped moon/island positions so nothing important sits on top of the moon. Their body
  has `data-sea-life="calm"`: `home.js` then shows at most one creature every 18–35s (no whale).
  The user found the busy sea life too much on these pages.
- **Media kit = the professional side:** no snowman emotes, no tagline, no About or Highlights
  (the user felt they repeated things). Hero: name, pitch, the Sea of Thieves Partner badge between
  the pitch and the buttons, photo on the right. One numbers story only: "By the numbers"
  (plain wording; the user didn't understand "What a campaign gets you"; grouped YouTube / Kick,
  no overlapping stats: e.g. Kick "hours watched" was dropped), then "Who's watching" (follower row + age, gender and country charts).
  Bars are scaled to the biggest value in each list and must clearly render. No grow-in animation
  on bars: an element scaled to zero width never registers as "in view", so they stayed empty.
  The far island peeks out to the right of the photo (page-scoped, slightly brightened). Then Ways to partner,
  Goody's case study + "Your brand here", contact band.
- **Home vs media kit:** the home "Work with me" is only a teaser (Goody's + "See the media kit");
  never copy media-kit content (stats, offer list) back onto the home page.
- **Merch:** no animated snowman (the user disliked it). Balanced two-column hero (text left,
  cycling product stack right). **Every product photo sits on `#e5e5e5`** (Fourthwall's studio
  grey), filling its 3:4 box with no frames or tints, so transparent items (Drip pieces, shorts)
  and white items (white sticker) look consistent and visible.

## UPC brand guidelines

UPC is a **separate brand** from FrostyReal. Never mix the palettes (no frost blue on UPC pages, no
UPC teal/red on FrostyReal pages). One approved exception: the home page's UPC band uses UPC art
and colors (and the header's UPC tab has a tiny teal/red ember effect). The UPC header's "back to FrostyReal" chip shows the snowman on a **black** badge (the
user rejected frost blue there), so no frost blue appears on UPC pages.

**Theme:** a Sea of Thieves PvP fight night. The art (`images/upc-bg.jpg`, `upc-poster.jpg`,
`upc-logo.jpg`) shows two factions clashing in smoke: teal Guardians skull on the left, red Servants
hourglass on the right. The "VS" split (teal left, red right, parchment-stone type in the middle) is
the core motif.

**Colors** (tokens in `upc.css`):

| Role | Hex | Token |
|------|-----|-------|
| Darkest background | `#081013` | `--ink` |
| Panel background | `#0d181c` | `--ink-2` |
| Fog / raised surface | `#16252b` | `--fog` |
| Steel (muted lines, icons) | `#3f5b66` | `--steel` |
| Teal (Discord / primary actions, left side) | `#0a8f6c` | `--teal` |
| Teal bright (focus, highlights) | `#19c79a` | `--teal-bright` |
| Red (YouTube / secondary actions, right side, wax seals) | `#a8121b` | `--red` |
| Red bright | `#e0323c` | `--red-bright` |
| Parchment stone (headlines, text) | `#eadfc4` | `--stone` |
| Stone dim (secondary text) | `#b9b19b` | `--stone-dim` |
| Thin borders | `rgba(234,223,196,.16)` | `--line` |

**Type:** Bowlby One for headlines, Barlow for body, Barlow Condensed for small UI and meta.
Sentence case (the wordmark image is the only all-caps).

### "Fight Night" direction (the live UPC page, `upc.html`)
- **Hero (100vh) — the user loves it, keep it as is:** `upc-bg.jpg` with teal and red smoke drifting toward a glowing center seam,
  rising embers (teal left, warm right), and the `upc-wordmark.png` slamming in with a short shake
  and dust ring. Headline: "Pick your rival. Pick the rules. Settle it on Saturday night."
- **Header must feel as rich as the hero:** wordmark image as the logo (glow via `filter:
  drop-shadow` that follows the letters, never a background box: that showed as a grey rectangle),
  nav tabs as Sea of Thieves-style plaques (dark 6px-rounded plate with a split teal|red underline on
  hover/active, tiny diamond separators), a "back to FrostyReal" chip with the snowman logo on a
  black badge, and the teal "Join the Discord" button. **No notched-corner `clip-path` on header,
  tabs or buttons**: the user saw it as clipping. Scrolled header gets a faint split teal|red bottom border.
- **Text must never look bland:** every h2 gets the stone bevel (like the wordmark) plus a small
  teal|red rule with a crossed-swords ornament. Labels use Barlow Condensed.
- **Discord is the main call to action** (sign-ups and community): teal button, always visible in
  the header. YouTube is the secondary (red) action. Don't scatter extra Subscribe buttons: the
  YouTube Subscribe button lives in the Join the crew band, next to the Discord button.
- **Background embers (whole page below the hero):** a fixed, `pointer-events:none` layer
  (`.amb` in `upc.html`, canvas `#amb-cv`, JS in `upc.js`) sits behind every section: sparse, dim
  small embers rising slowly (teal on the left half, red/orange on the right; about 36 on desktop,
  18 on phones) plus two big, very soft breathing faction glows (about 1.5x their first size) at the far left (teal) and right (red)
  edges. Sections `#modes`/`#discord` use translucent gradients so it shows through; the hero is
  opaque and sits above it (no double embers). Fully off under `prefers-reduced-motion` (canvas
  hidden, glows static) and paused when the tab is hidden.
- **Visitor stats:** `GOATCOUNTER` in the `upc.js` edit block ("" = off); when set it injects the
  GoatCounter script once. Key links carry `data-goatcounter-click` names.
- **Keyboard:** a "Skip to content" pill is the first focusable element (targets `<main id="main">`);
  focus rings are inset inside clipped boxes (video facades, mode chips, phone nav row).
- **Sections:**
  - How it works: a night sea chart (grid lines, faint hand-drawn islands with jagged coastlines,
    a compass rose with N/E/S/W, N in red) with a dashed voyage route through exactly **three**
    steps: medallion 1 (spyglass: scouting your rival), medallion 2 (scroll and quill), and medallion 3
    (crossed swords). Rings: 1 and 2 teal inner ring + teal ribbons, 3 red inner ring + red "3"
    ribbon (fight = red). The route ends at medallion 3; no red X behind it (the user removed it). Step 3's
    heading is "Fight night" and its line is "Live on Saturday nights at 6 PM ET on Kick and
    YouTube." (6 PM Eastern, confirmed by the user) with Kick and YouTube as links (new tab, teal/red underline on hover). The route drawing in is the page's
    only scroll reveal. No parchment notes or wax seals (the user said they didn't match the vibe).
  - Choose your fight (`#modes`): click a game mode and its rules video, description and "Call out
    a rival in the Discord" button appear. Search and Destroy is ONE mode with a map switcher in
    this order: Crescent Isle, Lone Cove, Thieves Haven; its icon is a gunpowder keg. No format
    picker and no fight card (the user found them confusing; keep it simple).
  - The Vault (`#vault`): tabs in this order: Trailer, Events (newest event's full VOD plus an
    "All events" card row with an "Event #2 coming soon" Discord card), Individual fights (all fight
    cuts across events, each tagged with its event). No playtest content (one-offs stay off).
  - Join the crew: Discord button (teal, left) and Subscribe on YouTube (red, right) side by side.
  - Footer: small wordmark, "Event director: FrostyReal".
- **Shapes:** small gritty 6px radius for panels/cards, chunky skewed buttons, pills only for chips.
- **Don't invent facts:** no fake dates, prizes, names or counts. The next event is "announced in
  the Discord".
- Discord invite: `https://discord.gg/4cmBrPPWyA`. YouTube: `@UltimatePirateChampionship`.
- **Rendering gotcha:** don't put glow layers on a `z-index:-1` pseudo-element inside an
  `isolation:isolate` panel. Transformed children (skewed buttons, bobbing icons) disappeared that
  way. Put glows in the panel's own `background` instead.

## Writing voice

Casual and hype: fun, energetic, gamer talk, like FrostyReal sounds on stream. This applies to all
new or rewritten text, including the media kit (keep facts and numbers accurate there).

## Content that goes stale

Claude makes content updates for the user (they tell Claude what changed; they don't edit files
themselves). Claude may look up current follower counts and newest videos/Shorts on Kick, YouTube and
TikTok, but must show the user what it found and get a yes before changing the files.

When asked to "update the numbers" or similar, these are the spots:

- **Follower counts** now live only in the `KIT` block of `mediakit.js` (`followers` + `updated`
  date). The home page no longer shows follower numbers, and the media kit has no headline stats strip.
- **Media kit data** (all in `KIT` in `mediakit.js`, never invent numbers):
  - Partner badge: `images/sot-partner.webp`.
  - Performance: YouTube avg views of the latest 4 long videos (41K), biggest video (530K),
    avg views per Short for Jul–Aug 2026 (11.8K; the user picked that window), plus Kick stats
    from Kick's official media-kit page (snapshot 2026-10-07). Kept honest on purpose: the 530K
    outlier is shown on its own instead of inflating the average.
  - Audience: YouTube Analytics, share of views in the last 28 days (October 2026), with a
    visible source line (`audience.source`).
  - Kick followers are 5.3K (Kick official, 2026-10-07); the follower note says "October 1–7, 2026".
- **Merch best sellers**: `FEATURED` at the top of `merch.js` (the hero's cycling product stack):
  `{ slug, image }`, where `image` picks the photo (1 is usually the back print). Order the user
  chose: Champion long sleeve back, Wavy tee back, Relax hoodie back (reclined snowman), then Drip
  cropped hoodie and Hat.
- **Featured video and video grid**: `FEATURED` and `LONG_VIDEOS` at the top of `home.js` (the
  first 4 long videos show). There are no Shorts on the site anymore.
- **Merch showcase products**: `MERCH_SHOWCASE` at the top of `home.js` (Fourthwall slugs).
- **Stream schedule**: the `<li data-day>` items in `index.html` (`#live`) and `DAYS`/`HOUR` in the
  schedule function in `home.js` (Eastern time) must match.
- **Sponsor**: Goody's Granola teaser card in `index.html` (`#partners`) and `media-kit.html` (case study
  plus a "Your brand here" slot). It's the only sponsor and
  no changes are planned, so don't build multi-sponsor features unless asked.
- **UPC page**: UPC is recurring, but there's no fixed set of things that change per event. Ask the
  user what's new each time rather than assuming. New events, VODs, fight cuts and game modes go in
  the "THINGS YOU CAN EDIT" block of `upc.js` (newest event first).
- **Merch order**: the `ORDER` array in `merch.js` (applies within each filter). The user gets it by opening `merch.html?arrange`,
  dragging products into place and pasting the list to Claude.

## External services

- **Fourthwall** (`merch.js`): `TOKEN` is Fourthwall's *public* storefront token, meant for the
  browser, so it's not a leaked secret. The cart is kept in `localStorage` (`fr_cart`), and checkout
  creates a Fourthwall cart, then sends the visitor to the Fourthwall-hosted checkout.
- **Kick**: the new home page uses a click-to-load Kick player (`player.kick.com/frostyreal`) and
  works out "Live now / Next stream" from the schedule in `home.js`.
- **Fourthwall on the home page**: `home.js` reads product photos for the merch showcase from the
  same public Storefront API and token as `merch.js`.
- **Kick live status** (`Kick` in `home.js`, poll interval `KICK_CHECK_MINUTES` in the edit block): reads
  `https://kick.com/api/v2/channels/frostyreal` on load and every 2 minutes while the tab is visible
  (paused when hidden). `livestream` non-null = live. It shows the header "LIVE on Kick" badge
  (`#live-badge`, frost-styled, hidden unless live; on phones it takes the brand name's spot and shows
  dot + "LIVE") on index, media-kit, merch and 404, and overrides the schedule-based "Live now" on the
  home hero chip and day tiles (real status wins; schedule is only the fallback when status is unknown,
  e.g. any fetch failure). The badge markup is copy-pasted in each page's header (UPC has none).
- **GoatCounter** (private visitor stats, cookie-free, no banner): **on since 2026-10-08** with the code
  `frostyreal` (dashboard: https://frostyreal.goatcounter.com). The code lives in `GOATCOUNTER` in the
  edit block of `home.js`; empty = nothing loaded or tracked. Important clicks carry
  `data-goatcounter-click` attributes (header, hero/CTA buttons, footer socials). The UPC page has its own
  constant in `upc.js`.
- **YouTube** embeds use `youtube-nocookie.com`. Thumbnails come from `i.ytimg.com`.
- Business contact address: `frostyrealkick@gmail.com` (mailto links).

## Website development

1. Load Superpower tools: frontend dev.
2. Use sub-agent development so tasks go to the right model. Prioritize Sonnet for implementations
   with clear instructions.
3. For any mockup, new page, redesign or visual change, use the `frontend-design:frontend-design`
   skill. The "Brand guidelines" section above and the tokens in `home.css` (and `upc.css` for
   UPC) are the brand guide. Give the
   skill room to propose inside the project's goals, shape before building, and audit before calling
   the work done.
4. After a visual change, check it in a browser at desktop and phone width (375px) with no
   horizontal scroll. `.claude/launch.json` has a `site` preview config (`python -m http.server
   8000`).

### Required tables

Model table: include every time a sub-agent is deployed.

| Task | Model | Plan provided | Review model |
|------|-------|---------------|--------------|

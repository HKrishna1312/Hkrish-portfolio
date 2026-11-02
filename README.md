# Hari Krishna P A — Portfolio

A production-ready, static portfolio for an AI Engineer. No build step, no
framework, no dependencies: plain HTML, hand-written CSS, and vanilla JS.

The visual system follows `UI/DESIGN.md` ("Obsidian Kinetic"): near-black
surfaces, razor-thin dividers, Space Grotesk / Inter / JetBrains Mono, and a
single electric-lime signal accent used only for state and emphasis.

---

## Preview locally

Any static server works:

```bash
npx serve .
# or
python -m http.server 4173
```

Then open <http://localhost:4173>. Opening `index.html` directly also works,
except the form will fall back to `mailto:` (the same fallback used until you
add a Formspree endpoint).

---

## Before you deploy — 4 quick edits

### 1. Personalise `assets/js/config.js`

```js
window.PORTFOLIO_CONFIG = {
  siteUrl: "https://your-domain.com",
  email: "1312harikrishna@gmail.com",
  availability: "Open to opportunities",
  formspreeEndpoint: "",          // paste your endpoint here
  socials: {
    github: "https://github.com/your-handle",
    linkedin: "https://www.linkedin.com/in/your-handle"
  }
};
```

Everything here is applied automatically to every link, badge, and the contact
fallback. `resumeUrl` defaults to the built-in `resume.html`.

### 2. Make the contact form live (2 minutes)

1. Create a free form at <https://formspree.io>.
2. Copy the endpoint (looks like `https://formspree.io/f/abcdwxyz`).
3. Paste it into `formspreeEndpoint` in `assets/js/config.js`.

That is it — the form validates inline, sends over `fetch`, shows a success or
error state, and has a honeypot field for spam. Until an endpoint is configured,
submitting opens the visitor's email client with the message pre-filled.

### 3. Replace the placeholder profile photo

Drop your photo in at `assets/img/profile.jpg` (portrait crop, ~768×1376 or
larger). The frame uses `object-position: 50% 22%`; adjust it in
`assets/css/styles.css` (`.portrait img`) if your face sits differently.

### 4. Update the domain in metadata

Search for `your-domain.com` and replace it with your real URL in:

- `index.html` — canonical, Open Graph, Twitter and JSON-LD
- `robots.txt`
- `sitemap.xml`

The social preview image is already generated at `assets/img/og.png`
(1200×630). Replace it if you change the branding.

---

## Deploy

### Netlify (recommended)

- Drag the project folder onto <https://app.netlify.com/drop>, **or**
- connect the repo with: build command *(none)*, publish directory `.`.

`netlify.toml` already sets security headers, long-lived asset caching, and a
pretty `/resume` URL.

### Vercel

Import the repo and deploy. There is no build command; the framework preset is
"Other" and the output directory is `.`. `vercel.json` adds clean URLs, headers,
and caching.

### GitHub Pages

1. Push the folder to a repository.
2. Settings → Pages → deploy from the `main` branch, root folder.

`.nojekyll` is included so the `assets/` directory is served as-is. All links are
relative, so it works from a project subpath too (update the canonical/OG/sitemap
URLs to match). If you use a custom domain, add a `CNAME` file.

### Cloudflare Pages / any static host

Upload the whole folder. Entry point: `index.html`.

---

## What is included

| Path | Purpose |
| --- | --- |
| `index.html` | Full one-page portfolio |
| `resume.html` | Print-ready résumé with "Save as PDF" |
| `404.html` | Styled not-found page |
| `assets/css/styles.css` | Design system + responsive layout |
| `assets/css/resume.css` | Résumé screen + print styles |
| `assets/js/config.js` | **Your** links, email, form endpoint |
| `assets/js/data.js` | Case study content for the drawer |
| `assets/js/main.js` | Navigation, scrollspy, reveal, modal, form, copy |
| `assets/fonts/` | Self-hosted Space Grotesk, Inter, JetBrains Mono |
| `assets/img/` | Portrait + generated social card |
| `netlify.toml`, `vercel.json` | Host config (headers, caching, redirects) |
| `robots.txt`, `sitemap.xml`, `site.webmanifest` | SEO / install metadata |

### Interactions that work

- Sticky floating nav with scroll progress, scrollspy, and a mobile drawer.
- Scroll-reveal animations that respect `prefers-reduced-motion`.
- Agent terminal in the About section with a replay control.
- Project case-study drawer with deep links (`/#case-salesforce`), native
  `<dialog>` focus handling, Esc/backdrop close, and history support.
- Contact form with inline validation, loading/success/error states, honeypot,
  and Formspree integration (with `mailto:` fallback).
- Copy-email with clipboard fallback and a toast instead of `alert()`.
- Self-hosted fonts, locally hosted images, semantic markup, skip link, focus
  styles, JSON-LD, Open Graph/Twitter metadata.

### Editing case studies

All drawer content lives in `assets/js/data.js`:

```js
window.CASE_STUDIES = {
  salesforce: { category, title, summary, meta, problem, solution,
                contributions, highlights, stack },
  // ...
};
```

Add a key there and a matching `data-case="your-key"` button anywhere in
`index.html`. The copy currently reflects the project descriptions that were in
`UI/code.html`; review it for accuracy before publishing.

---

## Content notes

- The portrait and monogram were sourced from the original `UI/code.html`
  (the monogram URL returned HTML, so the site now uses a crisp CSS/SVG
  monogram instead).
- Social URLs are intentionally placeholders until you add your handles.
- No analytics, cookies, or third-party scripts are loaded. Fonts and images are
  served from your own domain.

# NERDDISCO Website

> This document provides essential context for developers and AI agents working in this codebase for the first time.

## Project Overview

**NERDDISCO** (nerddis.co) is the personal portfolio website for Tim Pietrusky. The site showcases:

- **Shows**: Live performances with audio-reactive visuals
- **Talks**: Conference presentations and workshops
- **Demos**: Interactive CodePen experiments and web demos
- **NFTs**: Digital art pieces
- **Music Videos**: Visual collaborations with musicians
- **Posts**: Technical articles and documentation

Tim is associated with organizations like [Runpod](https://runpod.io), [wandler](https://wandler.ai), [JSConf Budapest](https://jsconfbp.com), [Banana Bass Music](https://bananabassmusic.com), [vcync](https://github.com/vcync), and [LiveJS](https://livejs.network).

---

## Tech Stack

| Technology                                                      | Purpose                                          |
| --------------------------------------------------------------- | ------------------------------------------------ |
| **[Hugo](https://gohugo.io/)**                                  | Static site generator (v0.83.1+)                 |
| **PostCSS**                                                     | CSS processing with autoprefixer and imports     |
| **[Workbox](https://developers.google.com/web/tools/workbox/)** | Service Worker generation for PWA support        |
| **Netlify**                                                     | Hosting and CI/CD (auto-deploys on master merge) |
| **CloudCannon**                                                 | CMS integration for content editing              |

---

## Directory Structure

```
nerddis.co/
├── assets/                 # Hugo-processed assets
│   ├── css/
│   │   ├── nerddisco.css  # Main stylesheet
│   │   └── grid.css       # Grid/layout utilities
│   └── js/
│       └── filter.js      # Content filtering logic
├── content/               # Markdown content files (blog posts, pages)
├── layouts/
│   ├── _default/          # Default page layouts
│   ├── clean/             # Minimal layout (for slides)
│   ├── subpage/           # Blog post/article layout
│   ├── partials/          # Reusable template fragments
│   │   ├── head.html      # <head> with meta, CSS inlining
│   │   ├── header.html    # Hero section with logo + bio
│   │   ├── footer.html    # Footer + PWA script
│   │   ├── shows.html     # Shows grid with filters
│   │   ├── shows-next.html # Upcoming events section
│   │   ├── social.html    # Social links
│   │   └── sw.html        # Service worker registration
│   └── shortcodes/        # Custom Hugo shortcodes
│       ├── attention.html # Highlighted call-to-action
│       ├── date.html      # Date formatting
│       ├── img-link.html  # Image with link
│       ├── list.html      # Custom list styling
│       └── meta.html      # Metadata display
├── static/                # Static assets (copied as-is)
│   ├── favicon/           # Favicon variants
│   ├── font/              # Custom fonts (Badd Mono, Fragment Mono)
│   ├── img/               # Logo and misc images
│   ├── shows/             # Show thumbnails (optimized JPGs)
│   │   └── original/      # Original high-res images
│   ├── social/            # Social media SVG icons
│   └── js/                # PWA helper components
├── public/                # Generated output (DO NOT EDIT DIRECTLY)
├── themes/landing-page/   # Base Hugo theme (mostly overridden)
├── config.toml            # MAIN CONFIGURATION (shows, social, events)
├── netlify.toml           # Netlify build configuration
├── cloudcannon.config.yml # CloudCannon CMS configuration
├── workbox-config.js      # Service worker configuration
├── postcss.config.js      # PostCSS configuration
└── image-convert.sh       # Image optimization script
```

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         config.toml                             │
│  (Shows, Social Links, Next Events, Site Params)                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                          Hugo Build                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │  layouts/    │  │   assets/    │  │     content/*.md     │   │
│  │  (templates) │  │  (CSS, JS)   │  │  (Markdown content)  │   │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬───────────┘   │
│         │                 │                      │               │
│         └─────────────────┴──────────────────────┘               │
│                           │                                      │
│                           ▼                                      │
│                    PostCSS Processing                            │
│                    (inline imports, minify)                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         public/                                  │
│                    (Generated Static Site)                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Workbox Service Worker                        │
│               (Caches assets for offline PWA)                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         Netlify                                  │
│              (Hosts & auto-deploys on git push)                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Key Configuration: `config.toml`

The `config.toml` file is the **heart of the site's content**. Most data is defined here, not in separate content files.

### Site Basics

```toml
baseURL = "https://nerddis.co/"
title = "NERDDISCO"
theme = "landing-page"
```

### Social Links

```toml
[[params.social]]
  title = "bluesky"
  icon = "bluesky"      # Matches static/social/{icon}.svg
  url = "https://bsky.app/profile/nerddis.co"
```

### Upcoming Events (`params.next`)

```toml
[[params.next]]
  date = "2025/03/15 - 09:30 CET - 2025/03/16 19:00 CET"
  title = "Tim mentoring @ {Tech: Munich} AI Hackathon"
  url = "https://lu.ma/8a0p94em"
```

### Shows/Portfolio Items (`params.shows`)

```toml
[[params.shows]]
  date = "2025/02/27"
  title = "Democratize AI with the Browser @ DataStax Berlin AI Meetup"
  img = "20250227_DataStax_Berlin_AI_Meetup_Saddleback_Berlin_Germany"
  url = "https://youtu.be/y8AfQf1Sxns"
  length = "00:32:01"
  type = "talk"          # Options: show, talk, demo, post, nft, musicvideo
  target = "_blank"      # Optional: "_self" for internal links
```

**Image Naming Convention**: `YYYYMMDD_Artist_Event_Venue_City_Country`

---

## Content Types & Filters

The homepage displays shows in a filterable grid. Content types:

| Type         | Description                                    |
| ------------ | ---------------------------------------------- |
| `show`       | Live performances, DJ sets                     |
| `talk`       | Conference talks, workshops                    |
| `demo`       | CodePen demos, interactive experiments         |
| `post`       | Blog articles (links to `/content/*.md` pages) |
| `nft`        | Digital art/NFT releases                       |
| `musicvideo` | Music video collaborations                     |

Types can be combined: `type = "nft|post"` (shows in both filters).

---

## Layouts & Templates

### Page Types

| Type      | Layout                 | Use Case                    |
| --------- | ---------------------- | --------------------------- |
| (none)    | `_default/single.html` | Simple content pages        |
| `subpage` | `subpage/single.html`  | Blog posts with intro image |
| `advent`  | `advent/list.html`     | Grid-based section listing sub-pages |
| `clean`   | `clean/single.html`    | Minimal (for slides/embeds) |

### Setting Page Type in Frontmatter

```yaml
---
title: "HEN 500000"
date: 2021-11-05T16:02:46+02:00
draft: false
type: "subpage"
img: "20211106_NERDDISCO_HEN_500000.jpg"
introimg: "shows/original/20211106_NERDDISCO_HEN_500000.jpg"
---
```

---

## CSS Architecture

### Custom Properties (CSS Variables)

The design system uses CSS custom properties in `assets/css/nerddisco.css`:

```css
:root {
  --color-white: #f8f8f8;
  --color-black: #000;
  --color-dark: #1b1b1b;
  --width-logo: 60vw;
  --space-around: 1.25rem;
  /* ... */
}
```

### Typography

- **Headings**: Badd Mono (custom font)
- **Body**: Fragment Mono (monospace)

### Responsive Breakpoints

- `1480px` - Large screens
- `1280px` - Medium screens
- `768px` - Mobile

### Key CSS Classes

- `.center` / `.center--items` - Flexbox centering
- `.columns` / `.columns--fit` - CSS Grid layouts
- `.space-around` - Padding utilities
- `.full-height` / `.half-height` - Viewport height utilities
- `.show` - Show card component
- `.solid` - Dark background
- `.hidden` - Display none (used by filter)

---

## PWA & Service Worker

The site is a Progressive Web App with offline support:

1. **Service Worker** generated by Workbox (`workbox-config.js`)
2. **Update Notification** via `<pwa-update-available>` custom element
3. **Web Manifest** at `static/site.webmanifest`

### Workbox Configuration

```javascript
module.exports = {
  globDirectory: "public/",
  globPatterns: ["**/*.{ico,svg,jpg,png,js,webmanifest,html}", ...],
  globIgnores: ["**/original/*", "**/live/**/*", ...],
  swDest: "public/sw.js",
};
```

---

## Development Workflow

### Prerequisites

1. Install [Hugo](https://gohugo.io/getting-started/installing/)
2. Install [Node.js](https://nodejs.org/)
3. Install [ImageMagick](https://imagemagick.org/) (for image conversion)

### Setup

```bash
git clone https://github.com/NERDDISCO/nerddis.co.git
cd nerddis.co
npm install
```

### Development Server

```bash
# Option 1: Hugo only (recommended for content editing)
npm run dev

# Option 2: Hugo + Workbox watching
npm start
```

**Local URL**: http://localhost:1313

### Build for Production

```bash
hugo --gc --minify && npm run build
```

---

## Writing Style

- **Voice**: First-person, direct, concise. Cut intros; get to the point. No emojis.
- **Structure**: Use clear `##` headings. For longer posts, start with **`## tl;dr`**. End with **`## conclusion`**; add **`## what's next?`** or **`## thanks`** when useful.
- **Formatting**: Use fenced code blocks with language tags (e.g., `bash`, `json`, `yaml`, `javascript`). Keep snippets minimal and actionable.
- **Shortcodes & Blocks**: Use `{{< meta ... >}}` to timestamp phases/sources and `{{< img-link ... >}}` for linked images. Wrap AI prompts or special callouts in `<div class="special"> ... </div>`.
- **Links**: Prefer descriptive anchors over bare URLs. Use internal links where possible.
- **Capitalization**: Casual/narrative posts can use all‑lowercase; technical/how‑to posts use standard capitalization.
- **Brand Names**: Always write "Runpod" (capital R, lowercase everything else). Not "RunPod" or "RUNPOD".
- **Frontmatter**: Follow patterns in "Adding a Blog Post". Typical posts use `type: "subpage"` and may include `img`, `tags`, and `description`.

---

## Adding New Content

### Adding a New Show

1. **Add the image** to `static/shows/original/` with naming: `YYYYMMDD_Description.jpg`

2. **Optimize images** (creates thumbnails):

   ```bash
   ./image-convert.sh
   ```

3. **Add entry to `config.toml`**:
   ```toml
   [[params.shows]]
     date = "2025/04/01"
     title = "Event Title @ Venue, City, Country"
     img = "20250401_Event_Title_Venue"
     url = "https://youtube.com/..."
     length = "01:00:00"
     type = "show"
   ```

### Adding a Blog Post

1. **Create content file** `content/my-post.md`:

   ```yaml
   ---
   title: "My Post Title"
   date: 2025-04-01T12:00:00+02:00
   draft: false
   type: "subpage"
   img: "20250401_my_post.jpg"
   ---
   Post content in Markdown...
   ```

2. **Add to shows** (optional, for homepage visibility):
   ```toml
   [[params.shows]]
     date = "2025/04/01"
     title = "My Post Title"
     img = "20250401_my_post"
     url = "/my-post"
     target = "_self"
     type = "post"
   ```

### Adding a Grid Section (e.g., Advent Calendar)

1. **Create section folder**: `content/my-section/`
2. **Create `_index.md`**:
   ```yaml
   ---
   title: "My Grid Section"
   type: "advent"
   ---
   Intro text...
   ```
3. **Add sub-pages**: Create `content/my-section/01.md`, etc.
4. **Add to config.toml**: Same as standard posts, pointing `url` to `/my-section`.

### Adding a Social Link

1. **Add SVG icon** to `static/social/{name}.svg`

2. **Add to config.toml**:
   ```toml
   [[params.social]]
     title = "platform"
     icon = "platform"
     url = "https://platform.com/username"
   ```

---

## Shortcodes Reference

### `{{< attention >}}`

Creates a highlighted call-to-action box:

```markdown
{{< attention url="https://example.com" name="Click here" >}}
```

### `{{< list >}}`

Wraps content in styled list:

```markdown
{{< list >}}

<li>Item 1</li>
<li>Item 2</li>
{{< /list >}}
```

### `{{< meta >}}`

Displays metadata block (date, reading time, etc.)

### `{{< img-link >}}`

Image with optional link wrapper

---

## Deployment

### Automatic (Recommended)

Push/merge to `master` branch → Netlify auto-builds and deploys.

### Manual Build

```bash
hugo --gc --minify && npm run build
```

Output is in `public/` directory.

---

## Performance Optimizations

The site is optimized for fast loading:

1. **Inline CSS** - Critical CSS embedded in `<head>`
2. **Optimized fonts** - Converted from OTF (76KB) to WOFF2 (7KB)
3. **Image optimization** - All JPGs at quality 1, lazy loaded
4. **Service Worker** - Caches assets for offline/repeat visits
5. **Async JavaScript** - Non-blocking script loading
6. **Minification** - CSS and JS minified in production

---

## Common Tasks

### Change the latest show background

The homepage hero background uses the **first show** in `params.shows`. Move the desired show to the top of the list in `config.toml`.

### Toggle "LIVE" mode

```toml
[params]
  isLive = true  # Shows live indicator
  liveText = '<span class="live">LIVE</span> on <a href="https://twitch.com/NERDDISCO">Twitch</a>'
```

### Add upcoming event

Add to the `[[params.next]]` array in `config.toml`. Comment out old events but keep them for reference.

### Debug service worker issues

1. Open DevTools → Application → Service Workers
2. Check "Update on reload"
3. Clear storage if needed

---

## Gotchas & Tips

1. **Don't edit `public/`** - It's generated and will be overwritten
2. **Image paths** - Use `shows/{name}.jpg` (without `/static/`)
3. **Internal links** - Set `target = "_self"` for pages within the site
4. **Draft posts** - Set `draft: true` in frontmatter (visible only with `-D` flag)
5. **CSS changes** - May need hard refresh due to service worker caching
6. **Show types** - Can combine with `|` separator: `type = "nft|post"`

---

## Related Resources

- [Hugo Documentation](https://gohugo.io/documentation/)
- [Workbox Documentation](https://developers.google.com/web/tools/workbox)
- [modV](https://modv.vcync.gl/) - Visual tool used for many shows
- [LiveJS Network](https://livejs.network/) - Collaborative live coding group

---

_Last updated: December 2025_

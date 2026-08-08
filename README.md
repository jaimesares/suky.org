# suky.org

Holding page for suky.org, built with [Astro](https://astro.build) 7 as a fully static
site and deployed to Cloudflare Pages.

## Stack

- **Astro 7** with `output: 'static'` — the build is plain HTML/CSS/JS, no adapter, no server runtime.
- **Self-hosted fonts** via Astro's built-in font pipeline (`fonts` in `astro.config.mjs`).
  Baloo 2 is downloaded at build time and served from `/_astro/fonts/`, so the page makes
  no third-party requests.
- **No UI framework.** The two background effects are vanilla scripts that Astro bundles,
  minifies and inlines into the page.

The whole site is a single ~13 KB HTML document plus two WOFF2 files.

## Structure

```
src/
  components/
    ColorField.astro   WebGL colour field background (+ CSS gradient fallback)
    PawTrails.astro    canvas paw prints crossing the screen
  layouts/
    Base.astro         document shell, metadata, background layer stack
  pages/
    index.astro        page content and its scoped styles
  styles/
    global.css         reset, design tokens, background layers
public/
  _headers             Cloudflare Pages response headers
  favicon.svg
  robots.txt
```

### Design tokens

The palette and typography variables live in `src/styles/global.css`:

| Token      | Value     |
| ---------- | --------- |
| `--night`  | `#0C1418` |
| `--moss`   | `#1F6F5C` |
| `--honey`  | `#F2A03D` |
| `--coral`  | `#F2645A` |
| `--cream`  | `#FBF3E4` |

To change the typeface, edit the `fonts` entry in `astro.config.mjs` and the `--display` /
`--util` variables in `global.css`.

### Motion and fallbacks

- `prefers-reduced-motion: reduce` freezes the colour field on a single frame, stops the
  progress bar and the breathing animation, and draws the paw trails statically.
- If WebGL is unavailable (or the context is lost), `body` gets `no-webgl` and an animated
  CSS gradient replaces the shader.

## Commands

| Command           | Action                                              |
| ----------------- | --------------------------------------------------- |
| `pnpm dev`        | Dev server at `localhost:4321`                       |
| `pnpm build`      | Build the static site to `dist/`                     |
| `pnpm preview`    | Serve the built site locally                         |
| `pnpm check`      | Type-check `.astro` files                            |
| `pnpm cf:preview` | Build and serve through the Cloudflare Pages runtime |
| `pnpm deploy`     | Build and deploy to Cloudflare Pages                 |

> `astro check` needs TypeScript 6.x — TypeScript 7's native compiler does not yet expose
> the programmatic API the Astro language server uses.

The pnpm version is pinned through `packageManager` in `package.json`. This is required,
not cosmetic: the build-script allowlist lives in `pnpm-workspace.yaml` under `allowBuilds`,
which is pnpm 11 syntax. Cloudflare's build image ships pnpm 10, which reads that file as a
workspace manifest and aborts with `packages field missing or empty`. With the field pinned,
pnpm 10 delegates to the declared version and the install succeeds.

## Deploying to Cloudflare Pages

The project is configured in `wrangler.jsonc` (`pages_build_output_dir: "dist"`).

**From the CLI:**

```sh
pnpm wrangler login   # once
pnpm deploy
```

**From the dashboard (Git integration):** connect the repository and use

- Build command: `pnpm build`
- Build output directory: `dist`

Either way `public/_headers` is picked up automatically: hashed assets under `/_astro/*`
get a one-year immutable cache, and every response gets basic security headers.

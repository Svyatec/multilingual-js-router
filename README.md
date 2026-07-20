# multilingual-js-router

Vanilla-JS i18n router for 8-language static sites — no build tools, no dependencies.

## Features

- **8 languages**: ru · en · de · fr · zh · ja · ko · th
- Language detection from URL path and browser `Accept-Language`
- Smart URL routing between language versions
- First-visit language banner (skips bots/crawlers)
- Static folder support (`/de/`, `/fr/`, etc.)
- Bot-aware: skips redirects for SEO crawlers and AI agents

## Live demo

[svyatkozloff.com](https://svyatkozloff.com) — personal portfolio in 8 languages

## Files

| File | Description |
|------|-------------|
| `js/i18n.js` | Core router — language detection, switching, banner |
| `tools/build.mjs` | Build script — injects header/footer partials into HTML pages |

## How it works

```js
// Language target resolution
INTL.target('de') // → https://svyatkozloff.com/de/
INTL.target('ru') // → https://svyatkozloff.ru/
INTL.target('en') // → https://svyatkozloff.com/
```

Language folders (`/de/`, `/fr/`, `/zh/`, `/ja/`, `/ko/`, `/th/`) are pre-generated static HTML — the router handles navigation between them.

## Stack

Plain JavaScript (ES5+), zero dependencies, ~200 lines of core logic embedded in a translation dictionary.

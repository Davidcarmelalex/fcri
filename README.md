# FCRI

Fusion Civilization Research Institute public platform.

## Positioning

FCRI is being shaped as a serious institutional website for frontier science, publications, fellowships, courses, research programs, and support.

- public domain: `fcri.science`
- umbrella ecosystem: `Voltex Network`
- institute base: Liberland
- product scope: institutional web presence, research archive, academic programs, support and donor pathways

## Stack

- Next.js 16
- React 19
- static export deployment model

## Repository Layout

```text
src/                    application routes and content surfaces
deploy/nginx/           static hosting config
deploy/systemd/         optional web service wrapper
```

## Local Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The build produces a standalone Next.js server bundle suitable for systemd + Nginx deployment.

## Key Documents

- [Operations](./OPERATIONS.md)
- [Content Model](./CONTENT_MODEL.md)
- [Progress](./PROGRESS.md)

## Current Direction

FCRI is being refined from a placeholder and research bundle into a world-class institutional platform that can credibly present publications, academic programs, and funding/support pathways.

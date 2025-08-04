# Image Processing API Microservice

[![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Sharp](https://img.shields.io/badge/Sharp-00bfae?logo=sharp&logoColor=white)](https://sharp.pixelplumbing.com/)
[![Jasmine](https://img.shields.io/badge/Tested%20with-Jasmine-8A4182?logo=jasmine&logoColor=white)](https://jasmine.github.io/)
[![Microservice](https://img.shields.io/badge/Architecture-Microservice-blueviolet)](https://en.wikipedia.org/wiki/Microservices)

A lightweight, **stateless** micro-service that resizes images on-the-fly. Supplied images are fetched from disk, resized with [Sharp](https://sharp.pixelplumbing.com/), cached locally (or to shared storage), and streamed back to the client.

---

## Table of Contents

1. [Architecture](#architecture)
2. [Getting Started](#getting-started)
3. [Environment Variables](#environment-variables)
4. [API Reference](#api-reference)
5. [Project Scripts](#project-scripts)
6. [Testing](#testing)
7. [Folder Structure](#folder-structure)
8. [Docker](#docker)
9. [Roadmap](#roadmap)
10. [License](#license)

---

## Architecture

```
Client ───► HTTP (GET /placeholder) ───► Express Router ──► Controller
                                                 │
                                                 │   (miss)
                                                 ▼
                              Local / S3 Cache  ◄─┐  Sharp Resizer
                                                  └─► Cached file (hit)
```

- Written in **TypeScript** for type-safety
- Single responsibility: _image resize & convert_
- Exposes one public endpoint (`/placeholder`)
- Horizontal-scaling friendly – no session state is kept in memory

---

## Getting Started

```bash
# 1. install dependencies
npm install

# 2. copy sample env and adjust paths/ports if needed
cp .env.example .env

# 3. start the dev server (nodemon + ts-node)
npm run img
```

Visit e.g.:

```
http://localhost:4000/placeholder?image=DMASO1.jpg&width=400&height=400
```

> The `full/` directory already contains a few demo images.

### Build for Production

```bash
npm run build   # tsc
node dist/index.js
```

---

## Environment Variables

| Variable    | Default   | Description                                  |
| ----------- | --------- | -------------------------------------------- |
| `PORT`      | `4000`    | Port the HTTP server listens on              |
| `FULL_DIR`  | `./full`  | Directory holding **original** images        |
| `THUMB_DIR` | `./thumb` | Directory where cached thumbnails are stored |

Create a `.env` file at the project root; any missing variables fall back to the defaults shown above.

---

## API Reference

### `GET /placeholder`

Resize (and optionally convert) an image.

| Query param | Type   | Required | Default | Description                                   |
| ----------- | ------ | -------- | ------- | --------------------------------------------- |
| `image`     | string | ✅       | –       | File name located in `FULL_DIR`               |
| `width`     | number | ❌       | `400`   | New width in px                               |
| `height`    | number | ❌       | `400`   | New height in px                              |
| `format`    | string | ❌       | `jpg`   | `jpg`, `png`, `webp`                          |
| `quality`   | number | ❌       | `80`    | 1-100 compression quality (for lossy formats) |

#### Successful response

- **Code:** `200 OK`
- **Content-Type:** varies (`image/jpeg`, `image/png`, …)
- **Body:** binary image data

#### Error responses

| Code | When                                    |
| ---- | --------------------------------------- |
| 400  | Missing `image` or unsupported `format` |
| 404  | Source image not found                  |
| 500  | Unhandled server error                  |

#### Examples

```text
/placeholder?image=DMASO1.jpg                 # 400×400 JPEG (default)
/placeholder?image=logo.png&width=120&height=70&format=webp&quality=90
```

---

## Project Scripts

| Script          | Purpose                       |
| --------------- | ----------------------------- |
| `npm run img`   | Start dev server with nodemon |
| `npm run build` | Transpile TS → JS (`dist/`)   |
| `npm run test`  | Jasmine unit tests            |
| `npm run lint`  | ESLint code quality           |
| `npm run pret`  | Prettier formatting           |

---

## Testing

```bash
npm run test
```

Six unit tests cover routing, resize logic, and helper utilities (see `src/tests/`).

---

## Folder Structure

```
.
├── full/        # Original images
├── thumb/       # Cached thumbnails (auto-generated)
├── src/
│   ├── config.ts       # env handling
│   ├── index.ts        # entrypoint
│   ├── Routes.ts       # main router
│   ├── placeholder.ts  # controller
│   └── tests/          # Jasmine specs
└── README.md
```

---

## Docker

A minimal production image:

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --prod
COPY . .
CMD ["node", "dist/index.js"]
EXPOSE 4000
```

Build & run:

```bash
docker build -t image-api .
docker run -p 4000:4000 -e PORT=4000 image-api
```

<!-- ---

## Roadmap

- [ ] Health & readiness probes (`/healthz`, `/readyz`)
- [ ] Prometheus metrics
- [ ] External object-storage cache (S3/MinIO)
- [ ] Helm chart & GitHub Actions deployment pipeline -->

---



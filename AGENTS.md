# Project Guidelines

## Overview

ChatLingo is a JavaScript MERN application: a React/Vite client, an Express/Mongoose API, and shared Zod schemas.

## Structure and Architecture

- `client/src/`: React pages, components, hooks, API clients, and UI utilities. Vite proxies `/api` requests to the server.
- `server/src/`: Express app and routes, controllers, middleware, Mongoose models, validators, and utilities.
- `shared/schemas/`: validation schemas imported by both client and server. Extend shared schemas here instead of duplicating validation.
- `server/src/tests/`: Vitest tests, including API tests with Supertest and an in-memory MongoDB.

## Conventions

- Use JavaScript ES modules; follow the formatting and import style of nearby files.
- Keep HTTP route declarations in `server/src/routes/` and request handling in `server/src/controllers/`.
- Client components and pages use PascalCase `.jsx` filenames; hooks use the `use` prefix.
- Backend filenames use role suffixes such as `.routes.js`, `.controller.js`, and `.model.js`.

## Development and Quality Checks

- `npm run dev` — run client and server together.
- `npm run client` / `npm run server` — run one side from the repository root.
- `npm run build` — build the client.
- `npm run lint --prefix client` — lint the client.
- `npm test --prefix server` — run server tests; `npm run test:watch --prefix server` runs them in watch mode.
- Configure server environment variables using `server/.env.example`; do not commit local `.env` files.

There are no root-level test or lint scripts. Install dependencies for the root, client, and server packages separately when needed.

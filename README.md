# ChatLingo

ChatLingo is a MERN chat application with a React/Vite client, an Express API backed by MongoDB, and Stream Chat/video integrations.

## Prerequisites

- Node.js and npm
- MongoDB running locally or a MongoDB Atlas connection string
- A Stream account and app with an API key and secret

## Install

From the project root, install each package:

```bash
npm install
npm install --prefix server
npm install --prefix client
```

## Configure environment

Create `server/.env` from the example. In PowerShell:

```powershell
Copy-Item server/.env.example server/.env
```

In macOS/Linux:

```bash
cp server/.env.example server/.env
```

Set the server variables in `server/.env`:

| Variable | Purpose |
| --- | --- |
| `NODE_ENV` | Use `development` for local work. |
| `MONGO_URI` | MongoDB connection string, for example `mongodb://localhost:27017/chatlingo`. |
| `PORT` | API port; use `5000` with the default Vite proxy. |
| `JWT_SECRET` | Secret used to sign login tokens; replace the example value with a private random value. |
| `JWT_EXPIRES_IN` | Token lifetime, for example `7d`. |
| `CLIENT_ORIGIN` | Client origin allowed by CORS; use `http://localhost:5173` locally. |
| `STREAM_API_KEY` | API key for your Stream app. |
| `STREAM_API_SECRET` | Secret for the same Stream app. Keep this private. |

The provided `server/.env.example` contains the first five variables; add `CLIENT_ORIGIN`, `STREAM_API_KEY`, and `STREAM_API_SECRET`. Stream credentials are required for the API to start.

Create `client/.env.local` with:

```dotenv
VITE_API_BASE_URL=http://localhost:5000/api
VITE_STREAM_API_KEY=your_stream_api_key
```

`VITE_STREAM_API_KEY` must be the same Stream app key as `STREAM_API_KEY`. Vite variables are included in the browser bundle, so never put the Stream secret or other private credentials in the client env file. The API URL defaults to `http://localhost:5000/api`; set it explicitly if the API runs elsewhere. The default Vite proxy also targets port `5000`.

## Run locally

Start MongoDB first, then run both the client and API from the project root:

```bash
npm run dev
```

Open the client at `http://localhost:5173`. The API listens at `http://localhost:5000`; check `http://localhost:5000/api/test` for its health response and MongoDB connection status.

To run either side separately:

```bash
npm run server
npm run client
```

## Build and tests

Build the client:

```bash
npm run build
```

Lint the client and run the server tests:

```bash
npm run lint --prefix client
npm test --prefix server
```

## Project layout

- `client/` — React UI, Vite configuration, API clients, and pages.
- `server/` — Express routes/controllers, Mongoose models, middleware, and tests.
- `shared/schemas/` — schemas shared by the client and server.

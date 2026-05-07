# MERN ChatLingo Starter

This project is a local MERN starter setup with:

- `client`: React + Vite frontend
- `server`: Express + MongoDB backend

## 1) Install dependencies

Dependencies are already installed by setup. If needed again:

```bash
npm install
npm install --prefix client
npm install --prefix server
```

## 2) Configure environment

Create `server/.env` from `server/.env.example`:

```bash
cp server/.env.example server/.env
```

Update `MONGO_URI` if your MongoDB runs elsewhere.

## 3) Run in development

From the project root:

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`
- Health check: `http://localhost:5000/api/test`

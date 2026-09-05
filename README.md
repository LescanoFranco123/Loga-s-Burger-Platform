# 🍔 Loga's Burger Platform

**Full-stack digital menu and restaurant admin dashboard**, built with a security-first, single-admin authentication model. Customers get a live, always-available public menu; the owner manages every product from a protected dashboard.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express%205-339933?logo=nodedotjs&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-self--seeding-003B57?logo=sqlite&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT%20%2B%20bcrypt-black?logo=jsonwebtokens)
![License](https://img.shields.io/badge/License-MIT-green)

## Overview

Loga's Burger Platform is a two-part application:

- **Public menu** — a clean, categorized digital menu that customers can browse without any login.
- **Admin dashboard** (`/admin`) — a protected area where the restaurant owner creates, edits, and removes products, and renames categories.

The project was built end-to-end: database design, REST API, authentication, protected routes, and a deployment-ready configuration for splitting frontend and backend across separate cloud providers.

## Key Features

- **Single-admin authentication** — JWT-based sessions with bcrypt-hashed passwords. There is no public sign-up form: the one admin account is created (or rotated) via a CLI script (`npm run create-admin`), removing any web-facing account-creation attack surface.
- **Protected REST API** — product-mutating routes (`POST` / `PUT` / `DELETE`) require a valid token via Express middleware; the public `GET /products` endpoint stays open so the menu always loads for customers.
- **Self-initializing database** — on first run, the server creates its own SQLite schema and seeds the initial menu automatically. No manual migration step required to get a working environment.
- **Environment-based configuration** — port, CORS origin, JWT secret, and API base URL are all driven by environment variables, so the same codebase runs identically in local dev and in production.
- **Deployment-ready split architecture** — frontend and backend are designed to be deployed independently (e.g., Vercel for the frontend, Render/Railway for the backend), a common real-world pattern for full-stack apps.

## Tech Stack

| Layer          | Technology                              |
|----------------|-------------------------------------------|
| Frontend       | React 19, Vite, React Router              |
| Backend        | Node.js, Express 5                        |
| Database       | SQLite                                    |
| Authentication | JWT (jsonwebtoken) + bcryptjs             |
| Config         | dotenv                                    |

## Project Structure

```
logas-burger-platform/
├── backend/                  # REST API (Express + SQLite)
│   ├── controllers/
│   ├── middleware/           # JWT auth middleware
│   ├── models/                # Single shared DB connection (models/db.js)
│   ├── routes/
│   ├── database/              # init.sql, menu.sql
│   ├── create-admin.js        # CLI script to create/rotate the admin account
│   └── server.js
└── frontend/                  # Public menu + admin dashboard (React + Vite)
    └── src/
        ├── components/         # ProtectedRoute, cards, layout
        ├── pages/              # Menu, Login, Admin
        └── Services/           # Axios client + auth/product services
```

## Getting Started (Local Development)

### 1. Backend

```bash
cd backend
npm install
npm run create-admin   # create the admin username & password
npm start               # http://localhost:5000
```

On first run, the server automatically creates the database, its tables, and seeds the initial menu — no extra setup needed.

### 2. Frontend

In a separate terminal:

```bash
cd frontend
npm install
npm run dev              # http://localhost:5173
```

### 3. Using the app

- Public menu: `http://localhost:5173/`
- Admin login: `http://localhost:5173/login`
- Admin dashboard (requires login): `http://localhost:5173/admin`

## Admin Account Management

The system is designed around a **single admin account** by policy. To create or rotate it, run from `backend/`:

```bash
npm run create-admin
```

or pass credentials directly:

```bash
npm run create-admin -- myUsername myStrongPassword
```

Each run replaces the previous account — there is never more than one credential set with dashboard access, and it can only be created from a terminal with server access, never from the browser.

## Environment Variables

### Backend (`backend/.env`, optional locally)

See `backend/.env.example`:

| Variable      | Description                                                        | Default |
|---------------|-----------------------------------------------------------------------|---------|
| `PORT`        | Server port                                                            | `5000`  |
| `CORS_ORIGIN` | Allowed origin for API requests (your frontend's production URL)      | `*`     |
| `JWT_SECRET`  | Secret key used to sign session tokens                                 | example value (change in production) |

### Frontend (`frontend/.env`, optional locally)

See `frontend/.env.example`:

| Variable       | Description                          | Default                 |
|----------------|----------------------------------------|--------------------------|
| `VITE_API_URL` | Public URL of the deployed backend     | `http://localhost:5000`  |

## Deployment

This project separates frontend and backend, so it's designed to be deployed as two independent services:

- **Frontend** → [Vercel](https://vercel.com) (Root Directory: `frontend`)
- **Backend** → [Render](https://render.com), [Railway](https://railway.app), or [Fly.io](https://fly.io) (Root Directory: `backend`)

### Summary

1. Deploy `backend/` on Render (Build: `npm install`, Start: `npm start`) and set the `JWT_SECRET` environment variable.
2. From Render's Shell tab, run `npm run create-admin` to create the admin account on the live server.
3. Deploy `frontend/` on Vercel and set `VITE_API_URL` to your backend's Render URL.

> ⚠️ **Persistence note:** free tiers on Render/Railway may reset local disk on redeploy. For a fully persistent free database, consider migrating to a service like [Turso](https://turso.tech) (cloud SQLite), or use a plan with a persistent disk.

## License

MIT — see [LICENSE](./LICENSE).

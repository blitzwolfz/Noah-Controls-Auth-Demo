# Noah Controls Auth Demo

A self-contained demo comparing three authentication providers behind a single NestJS API and a React/Vite front end:

1. **Keycloak** – self-hosted OpenID Connect server
2. **SuperTokens** – self-hosted auth service with a Node SDK
3. **Better Auth** – framework-agnostic auth library backed by a local SQLite file

Each provider is wired up as its own NestJS module, exposed under `/api/<provider>/...`, and rendered as a dedicated tab in the front end. All three demonstrate the same three flows: sign up, log in, view a protected profile, log out.

## Stack

- Backend: NestJS 10, TypeScript, Passport where relevant
- Frontend: React 18, TypeScript, Vite
- Infra: Docker Compose (Postgres, Keycloak, SuperTokens core)
- Storage: Postgres for Keycloak and SuperTokens, SQLite file for Better Auth

## Layout

```
.
├── backend/         NestJS API (port 4000)
├── frontend/        Vite + React app (port 5173)
├── keycloak/        Realm import used on container start
├── docker-compose.yml
└── README.md
```

## Prerequisites

- Node.js 20+
- Docker Desktop (or Docker Engine + Compose v2)
- pnpm or npm

## Quick start

From the repo root:

```bash
# 1. start Postgres, Keycloak, SuperTokens core
docker compose up -d

# 2. install and run the backend (in a new terminal)
cd backend
cp .env.example .env
npm install
npm run start:dev

# 3. install and run the frontend (in a new terminal)
cd frontend
npm install
npm run dev
```

Then open http://localhost:5173.

The first Keycloak boot takes about 30 seconds. The realm `noah-demo` and a client `noah-demo-client` are imported automatically from `keycloak/realm-export.json`.

## Default URLs

| Service        | URL                              | Notes                            |
|----------------|----------------------------------|----------------------------------|
| Frontend       | http://localhost:5173            | React app                        |
| Backend API    | http://localhost:4000            | NestJS                           |
| Keycloak admin | http://localhost:8080            | admin / admin                    |
| SuperTokens    | http://localhost:3567            | core service, no UI              |
| Postgres       | localhost:5432                   | user `noah`, password `noah`     |

## Provider notes

### Keycloak
Uses the Resource Owner Password Credentials grant against the `noah-demo` realm so the demo can keep a unified front end (signup/login form per provider rather than a redirect). In a production setup you would prefer the Authorization Code flow with PKCE; the controller is small enough to swap.

### SuperTokens
The backend includes the SuperTokens middleware on `/api/supertokens/auth/*`. The front end calls `signUp`, `signIn`, and `signOut` through plain `fetch` so the demo doesn't need the SuperTokens React SDK.

### Better Auth
Configured with email/password and a local SQLite file at `backend/data/better-auth.sqlite`. The handler is mounted on `/api/better-auth/*` and stores sessions in the same file.

## Stopping

```bash
docker compose down       # keep data
docker compose down -v    # wipe Postgres + Keycloak state
```

## Troubleshooting

- **Keycloak login returns 401**: wait for the import to finish, or check `docker compose logs keycloak`.
- **SuperTokens connection refused**: the core takes a few seconds after Postgres is healthy.
- **Better Auth "no such table"**: delete `backend/data/better-auth.sqlite` and restart the backend; tables are created on boot.
- **CORS errors**: confirm the backend is on 4000 and the front end is on 5173. Both are configured in `backend/src/main.ts`.

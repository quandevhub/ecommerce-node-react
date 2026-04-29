# Ecommerce Node + React

Full-stack e-commerce application — Express.js REST API backend, React + TypeScript frontend.

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js, Express 5, MySQL 8 |
| Auth | JWT + bcryptjs |
| Frontend | React 19, TypeScript, Vite |
| State | Redux Toolkit |
| Styling | Tailwind CSS |
| Testing | Playwright (E2E) |
| Container | Docker + Compose |

## Quickstart

**Prerequisites:** Node.js 18+, Docker

```bash
# 1. Start backend + MySQL
cd backend
cp .env.example .env        # fill in JWT_SECRET, DB credentials
docker-compose up -d

# 2. Start frontend
cd frontend
npm install
npm run dev                 # http://localhost:5173
```

## Modules

| Module | Path | Description |
|---|---|---|
| Backend API | [backend/](backend/) | Express REST API, port 3000 |
| Frontend App | [frontend/](frontend/) | React SPA, port 5173 |

## Documentation

| Doc | Description |
|---|---|
| [Architecture](docs/architecture.md) | System design and data flow diagrams |
| [API Reference](docs/api.md) | All REST endpoints with examples |
| [Database](docs/database.md) | Schema and ER diagram |
| [Development Guide](docs/development.md) | Local setup and workflow |
| [Deployment Guide](docs/deployment.md) | Docker production deployment |
| [Testing Guide](docs/testing.md) | Playwright E2E test setup |

## License

MIT

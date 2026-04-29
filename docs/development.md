# Development Guide

## Prerequisites

- Node.js 18+
- Docker + Docker Compose
- Git

## Local Setup

### 1. Clone & install

```bash
git clone <repo-url>
cd ecommerce-node-react
```

### 2. Backend

```bash
cd backend
cp .env.example .env
```

Edit `.env`:
```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=ecommerce_node_react
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=1d
```

Start MySQL + backend via Docker:
```bash
docker-compose up -d
```

Or run backend only (requires local MySQL):
```bash
npm install
npm run dev     # nodemon, hot reload
```

### 3. Frontend

```bash
cd frontend
npm install
```

Create `.env`:
```env
VITE_API_BASE=http://localhost:3000/api
```

```bash
npm run dev     # http://localhost:5173
```

## Project Structure

See [project-structure.md](project-structure.md) for full directory layout.

## Development Workflow

```
feature branch → code → /commit → push → PR → review → merge develop
```

### Useful commands

```bash
# Backend
npm run dev           # Start with hot reload

# Frontend
npm run dev           # Start Vite dev server
npm run build         # TypeScript check + production build
npm run lint          # ESLint
npm run test          # Playwright E2E tests (requires dev server)
npm run test:ui       # Playwright interactive UI mode
```

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example |
|---|---|---|
| `PORT` | Server port | `3000` |
| `DB_HOST` | MySQL host | `localhost` |
| `DB_PORT` | MySQL port | `3306` |
| `DB_USER` | MySQL user | `root` |
| `DB_PASSWORD` | MySQL password | `secret` |
| `DB_NAME` | Database name | `ecommerce_node_react` |
| `JWT_SECRET` | JWT signing key | `random_string_32+` |
| `JWT_EXPIRES_IN` | Token expiry | `1d` |

### Frontend (`frontend/.env`)

| Variable | Description | Example |
|---|---|---|
| `VITE_API_BASE` | Backend API URL | `http://localhost:3000/api` |

## Code Conventions

- Backend: CommonJS (`require/module.exports`), callback-style mysql2
- Frontend: TypeScript strict, functional components, Redux Toolkit slices
- Commits: [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `chore:`, etc.)

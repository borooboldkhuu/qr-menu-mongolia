# QR Menu Mongolia ⚡

Монголын ресторан, кафе, кофе шопуудад зориулсан QR кодтой дижитал цэсний SaaS платформ.

## Технологи

| Layer | Tech |
|-------|------|
| Frontend | Next.js 14 + TypeScript + TailwindCSS |
| Backend | NestJS 10 + TypeScript |
| Database | PostgreSQL 16 + Prisma 5 |
| Deployment | Docker + Nginx |
| CDN | Cloudinary |

## Бүтэц

```
qr-menu-mongolia/
├── backend/          # NestJS API
├── frontend/         # Next.js Web
├── docs/             # Төлөвлөгөө, баримт бичиг
├── docker-compose.yml       # Dev
├── docker-compose.prod.yml  # Production
└── nginx.conf               # Reverse proxy
```

## Хөгжүүлэлт эхлүүлэх

### 1. Database

```bash
docker compose up -d postgres
```

### 2. Backend

```bash
cd backend
cp .env.example .env
# .env файлыг тохируулах
npm install
npx prisma migrate dev
npm run dev
# → http://localhost:3001
```

### 3. Frontend

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
# → http://localhost:3000
```

## Production Deploy

```bash
docker compose -f docker-compose.prod.yml up -d
```

## API Endpoints

| Method | Path | Auth |
|--------|------|------|
| POST | `/api/v1/auth/register` | No |
| POST | `/api/v1/auth/login` | No |
| GET | `/api/v1/auth/me` | Yes |
| GET | `/api/v1/restaurants` | Yes |
| POST | `/api/v1/restaurants` | Yes |
| CRUD | `/api/v1/restaurants/:slug/categories` | Yes |
| CRUD | `/api/v1/restaurants/:slug/items` | Yes |
| CRUD | `/api/v1/restaurants/:slug/qr-codes` | Yes |
| GET | `/api/v1/restaurants/:slug/analytics` | Yes |
| GET | `/api/v1/public/:slug/menu` | No |

## Лиценз

UNLICENSED — QR Menu Mongolia © 2026

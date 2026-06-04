# EasyMoney Backend

API REST para EasyMoney, una aplicación de finanzas personales.

## Tecnologías

- Node.js
- Express
- TypeScript
- PostgreSQL
- Prisma
- JWT
- bcryptjs
- Zod

## Instalación

```bash
npm install
cp .env.example .env
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

## Variables de entorno

```env
DATABASE_URL=""
JWT_SECRET=""
JWT_EXPIRES_IN="1d"
PORT=3000
CORS_ORIGIN="http://localhost:5173"
```

## Endpoints

- POST `/api/v1/auth/register`
- POST `/api/v1/auth/login`
- GET `/api/v1/auth/me`
- CRUD `/api/v1/categories`
- CRUD `/api/v1/transactions`
- GET `/api/v1/dashboard/summary`
- GET `/api/v1/admin/users`

## Admin

Para crear un admin rápido, cambia el rol desde la base de datos a `ADMIN` para un usuario registrado.

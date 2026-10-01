# Команды adminpanel

## Запуск бэкенда (API)

```bash
colima start                     # Docker (если нужно)
docker compose up -d             # Postgres
npm run dev                      # API http://localhost:3000
npx prisma db seed               # залить users
npx prisma studio                # GUI БД
npx tsc --noEmit                 # проверка типов
```

## API (curl)

```bash
curl -s http://localhost:3000/health

TOKEN=$(curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@admin.local","password":"password123"}' \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['token'])")

curl -s http://localhost:3000/users -H "Authorization: Bearer $TOKEN"

curl -s -X PATCH http://localhost:3000/users/3 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice From API"}'

curl -s -X DELETE http://localhost:3000/users/3 \
  -H "Authorization: Bearer $TOKEN"
```

## Prisma

```bash
npx prisma migrate dev --name имя_миграции   # после правок schema.prisma
npx prisma generate                          # клиент в src/generated/prisma
npx prisma db seed
npx prisma studio
npx prisma validate
```

## .env (корень API)

```env
DATABASE_URL="postgresql://adminpanel:adminpanel@localhost:5432/adminpanel?schema=public"
```

## Next.js (фронт в браузере)

```bash
# из корня adminpanel
npx create-next-app@15 web --typescript --eslint --app --src-dir --no-tailwind --import-alias "@/*" --use-npm
# на вопросы: можно согласиться с дефолтами / Turbopack — на твоё усмотрение

cd web
npm install                         # ОБЯЗАТЕЛЬНО: иначе next: command not found
npm run dev -- -p 3001          # фронт на http://localhost:3001
# API при этом должен крутиться отдельно на :3000
```

Если IDE краснит `import styles from "./login.module.css"` — обычно проходит после `npm install` (подтянутся типы Next). Если нет, создай `web/src/styles.d.ts`:
```ts
declare module "*.module.css" {
  const classes: { readonly [key: string]: string };
  export default classes;
}
```

В `web/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

На бэке CORS **до** роутов (в `src/express/server.ts`):
```ts
import cors from "cors";
app.use(cors({ origin: "http://localhost:3001" }));
app.use(express.json());
```

Два терминала одновременно:
1. корень → `npm run dev` (API :3000)
2. `web/` → `npm run dev -- -p 3001` (сайт)

### Логин — какие файлы создать

```text
web/.env.local
web/src/lib/api.ts
web/src/app/login/page.tsx
web/src/app/login/login.module.css
web/src/app/users/page.tsx          # после логина + кнопка Log out
web/src/app/users/users.module.css
web/src/app/page.tsx                # redirect → /login
```

Logout: чистит `localStorage` (`token`, `user`) и редирект на `/login`.
Без token на `/users` → редирект на `/login`.

Открывать: http://localhost:3001/login  
Учётка: `admin@admin.local` / `password123`

Полный код файлов — в чате с наставником (скопировать целиком).

## Структура

```text
adminpanel/                 API (Express + Prisma)
  src/...
  prisma/schema.prisma      User + Product
web/                        Next.js админка (браузер)
```

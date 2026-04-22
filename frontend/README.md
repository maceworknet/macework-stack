# Macework Full-Stack Next.js

Tek deploy icinde kurumsal site, admin paneli, API route'lari, Prisma/MySQL veri katmani, session tabanli auth ve local upload altyapisi.

## Tech Stack

- Next.js 16 App Router
- TypeScript
- Tailwind CSS 4
- Prisma ORM
- MySQL
- bcryptjs tabanli sifre dogrulama
- Zod validasyonlari
- Local file upload: `public/uploads`

## Ana Rotalar

- `/` kurumsal site
- `/admin` admin paneli
- `/login` admin girisi
- `/api/leads` lead kaydi ve admin listeleme
- `/api/upload` admin medya yukleme
- `/api/auth/logout` session cikisi

## Kurulum

1. Bagimliliklari yukleyin:

```bash
npm install
```

2. `.env.example` dosyasini temel alip `.env` olusturun:

```bash
DATABASE_URL="mysql://user:password@host:3306/macework"
AUTH_SECRET="long-random-secret"
ADMIN_EMAIL=admin@macework.com
ADMIN_PASSWORD=change-this-password
ADMIN_NAME="Macework Admin"
```

3. Veritabani semasini MySQL'e aktarip admin kullanici olusturun:

```bash
npm run db:push
npm run admin:create
```

4. Gelistirme sunucusunu baslatin:

```bash
npm run dev
```

## Production

Coolify veya benzeri tek deploy ortaminda:

```bash
npm install
npm run db:migrate
npm run build
npm run start
```

Ilk kurulumda `npm run admin:create` komutunu `ADMIN_EMAIL` ve `ADMIN_PASSWORD` env degerleriyle bir kez calistirin.

## Veri Katmani

Site sayfalari `src/lib/cms.ts` uzerinden veri okur. MySQL baglantisi hazir degilse `src/content/site-content.ts` fallback olarak kullanilir. Bu sayede frontend, veritabani migrasyonundan once de calisir.

## Klasorler

- `prisma/schema.prisma`: MySQL semasi
- `src/app/(admin)`: admin panel rotalari
- `src/app/api`: backend route handler'lari
- `src/lib`: Prisma, auth, upload ve CMS yardimcilari
- `public/uploads`: yuklenen medya dosyalari

# QR Menu Mongolia — Бүрэн Төлөвлөгөө

**Хувилбар:** 1.0 | **Огноо:** 2026-06-23 | **Зохиогч:** AutoBoro ⚡

---

## Агуулга

1. [Бизнес Модел](#1-бизнес-модел)
2. [Өрсөлдөгчийн Судалгаа](#2-өрсөлдөгчийн-судалгаа)
3. [Үнийн Багцууд](#3-үнийн-багцууд)
4. [Орлогын Тооцоо](#4-орлогын-тооцоо)
5. [Database Schema](#5-database-schema)
6. [Prisma Schema](#6-prisma-schema)
7. [API Бүтэц](#7-api-бүтэц)
8. [Folder Бүтэц](#8-folder-бүтэц)
9. [MVP Хувилбар](#9-mvp-хувилбар)
10. [3 Сарын Хөгжүүлэлтийн Төлөвлөгөө](#10-3-сарын-хөгжүүлэлтийн-төлөвлөгөө)
11. [100 Ресторантай Болох Маркетингийн Төлөвлөгөө](#11-100-ресторантай-болох-маркетингийн-төлөвлөгөө)
12. [Facebook Зар Сурталчилгааны Стратеги](#12-facebook-зар-сурталчилгааны-стратеги)
13. [Борлуулалтын Скрипт](#13-борлуулалтын-скрипт)

---

## 1. Бизнес Модел

### 1.1 SaaS (Software-as-a-Service)

**Сарын захиалгын төлбөртэй B2B SaaS.** Ресторан бүр сар бүр тогтмол төлбөр төлж QR цэс, админ самбар ашиглана.

### 1.2 Үндсэн Таамаглалууд

| Үзүүлэлт | Утга |
|----------|------|
| Нийт хаяглах боломжтой зах зээл (TAM) | ~3,500 ресторан/кафе (УБ + аймгууд) |
| Боломжит хаяглах зах зээл (SAM) | ~2,000 (УБ-д төвлөрсөн) |
| Эхний жилийн зорилт (SOM) | 100 байгууллага |
| Сарын дундаж төлбөр (ARPU) | ₮39,000–59,000 |
| Жилийн төлөвлөгөөт орлого (100 харилцагч) | ₮46,800,000–70,800,000 |

### 1.3 Орлогын Урсгалууд

| Урсгал | Тайлбар |
|--------|----------|
| **Үндсэн захиалга** | Сарын SaaS төлбөр (3 багц) |
| **QR код хэвлэлт** | Ширээний QR sticker, цэсний постер хэвлэх нэмэлт үйлчилгээ |
| **Онцгой захиалга** | Custom domain, нэмэлт хэрэглэгч, аналитик экспорт |
| **Setup төлбөр** | Нэг удаагийн тохиргооны төлбөр (заавал биш) |

---

## 2. Өрсөлдөгчийн Судалгаа

### 2.1 Монголын Зах Зээл

| Өрсөлдөгч | Давуу тал | Сул тал | Үнэ |
|----------|----------|--------|-----|
| **Menu.mn** | Томоохон тоглогч, ресторан нэгтгэл | Хоолны захиалгад чиглэсэн, QR цэс нь нэмэлт | Хувьсах |
| **QPay** | Төлбөрийн системтэй нэгдсэн | Цэсний менежмент муу, зөвхөн төлбөр | Үнэгүй (төлбөрийн шимтгэл) |
| **Хуучин цаасан цэс** | Ямар ч технологиос хамаарахгүй | Шинэчлэлт хийхэд хүнд, зардал их, COVID эрүүл ахуй | ₮0–50,000/цэс |
| **Гадаад SaaS (Toast, Lightspeed)** | Олон боломжтой | Англи хэл, үнэтэй, Монгол төлбөрийн системгүй | $69+/сар |

### 2.2 QR Menu Mongolia-н Өрсөлдөх Давуу Тал

1. **Монгол хэл дээр бүрэн** — Админ самбар, нийтийн цэс бүгд Монгол
2. **Хурдан бөгөөд хөнгөн** — Гар утасны 3G сүлжээнд ч хурдан ачаалагдана
3. **Хямд үнэ** — Олон улсын өрсөлдөгчдөөс 3–5 дахин хямд
4. **Энгийн** — Технологийн мэдлэг шаардахгүй, ямар ч ресторан 5 минутад тохируулна
5. **QR код үүсгэлт + хэвлэлт** — Бүрэн шийдэл нэг дороос
6. **Орон нутгийн дэмжлэг** — Монгол хэлээр 24/7 chat дэмжлэг

### 2.3 Зах Зээлийн Боломж

Монголд ~3,500 F&B байгууллага байдгаас:
- **~60%** (2,100) дижитал цэс ашигладаггүй
- **~25%** (875) PDF эсвэл зурган цэс ашигладаг
- **~15%** (525) ямар нэг дижитал шийдэлтэй (голчлон том сүлжээ)

**Боломж:** 2,100+ байгууллага дижитал шийдэлд шилжих боломжтой.

---

## 3. Үнийн Багцууд

### 3.1 Багц

| Онцлог | 🥉 Starter | 🥈 Pro | 🥇 Enterprise |
|--------|-----------|-------|-------------|
| **Үнэ/сар** | ₮29,000 | ₮49,000 | ₮79,000 |
| **Жилийн хөнгөлөлт** | ₮24,000/сар (-17%) | ₮39,000/сар (-20%) | ₮59,000/сар (-25%) |
| **Бүтээгдэхүүний тоо** | 50 хүртэл | 200 хүртэл | Хязгааргүй |
| **Ангилал** | 10 хүртэл | 30 хүртэл | Хязгааргүй |
| **QR код** | 1 ширхэг | 3 ширхэг | 10 ширхэг |
| **Зураг байршуулах** | Тийм (1 зураг/бүтээгдэхүүн) | Тийм (5 зураг/бүтээгдэхүүн) | Тийм (хязгааргүй) |
| **Аналитик** | Үндсэн | Дэлгэрэнгүй | Түүхэн + Экспорт |
| **Custom Domain** | ❌ | ❌ | ✅ |
| **Нэмэлт админ** | ❌ | 1 | 3 |
| **Тэргүүнтэй дэмжлэг** | Email | Chat (ажлын цагаар) | Chat 24/7 + Утас |
| **Setup тусламж** | Бие даан | 30 мин заавар | Бүрэн тохиргоо |

### 3.2 Setup Төлбөр (Заавал биш)

| Үйлчилгээ | Үнэ |
|-----------|-----|
| Бүрэн тохиргоо + цэс оруулах | ₮150,000 (нэг удаа) |
| QR sticker хэвлэлт (10 ширхэг) | ₮50,000 |
| QR постер хэвлэлт (A3) | ₮30,000 |
| Custom domain тохиргоо | ₮50,000 |

---

## 4. Орлогын Тооцоо

### 4.1 Сарын Орлогын Өсөлт

| Сар | Харилцагч | ARPU | Сарын орлого | Хуримтлагдсан |
|-----|----------|------|------------|-------------|
| 1 | 5 | ₮39,000 | ₮195,000 | ₮195,000 |
| 2 | 12 | ₮39,000 | ₮468,000 | ₮663,000 |
| 3 | 22 | ₮41,000 | ₮902,000 | ₮1,565,000 |
| 4 | 35 | ₮43,000 | ₮1,505,000 | ₮3,070,000 |
| 5 | 50 | ₮44,000 | ₮2,200,000 | ₮5,270,000 |
| 6 | 68 | ₮45,000 | ₮3,060,000 | ₮8,330,000 |
| 7 | 80 | ₮46,000 | ₮3,680,000 | ₮12,010,000 |
| 8 | 92 | ₮47,000 | ₮4,324,000 | ₮16,334,000 |
| 9 | 100 | ₮48,000 | ₮4,800,000 | ₮21,134,000 |
| 10 | 108 | ₮48,000 | ₮5,184,000 | ₮26,318,000 |
| 11 | 116 | ₮48,000 | ₮5,568,000 | ₮31,886,000 |
| 12 | 125 | ₮49,000 | ₮6,125,000 | ₮38,011,000 |

> **Жилийн орлогын таамаг:** ~₮38 сая (~$11,000)  
> **Churn rate таамаг:** 5%/сар (бодит, консерватив)  
> **Орлогын өсөлт:** Сарын 15–20% (нийлмэл)

### 4.2 Зардлын Бүтэц (Сарын)

| Зардал | Эхний 3 сар | 4–12 сар |
|--------|------------|---------|
| **VPS (4GB, 2vCPU)** | ₮200,000 | ₮200,000 |
| **Домен (.mn)** | ₮15,000/жил | ₮15,000/жил |
| **Cloudinary (зураг CDN)** | Үнэгүй tier | ₮50,000 |
| **Маркетинг (FB зар)** | ₮300,000 | ₮500,000–1,000,000 |
| **Бусад (имэйл, SSL)** | ₮50,000 | ₮100,000 |
| **Сарын нийт зардал** | ₮550,000–750,000 | ₮850,000–1,350,000 |

### 4.3 Break-Even Тооцоо

- **Сарын тогтмол зардал:** ~₮850,000 (VPS + маркетинг + бусад)
- **Break-even харилцагч:** 850,000 / 44,000 ≈ **20 харилцагч**
- **Break-even хүрэх хугацаа:** ~3-р сар
- **Цэвэр ашиг (12-р сар):** ₮6,125,000 - ₮1,350,000 = **₮4,775,000/сар**

---

## 5. Database Schema

### 5.1 Хүснэгтүүд

```
┌─────────────────────────────────────────────────────────┐
│                       DATABASE                           │
│                   qr_menu_mongolia                        │
└─────────────────────────────────────────────────────────┘

┌──────────────┐     ┌──────────────────┐     ┌──────────────┐
│    users     │     │   restaurants    │     │  categories  │
├──────────────┤     ├──────────────────┤     ├──────────────┤
│ id (PK)      │────→│ id (PK)          │────→│ id (PK)      │
│ email        │     │ user_id (FK)     │     │restaurant_id  │
│ password     │     │ name             │     │ name          │
│ name         │     │ slug (unique)    │     │ description   │
│ phone        │     │ logo_url         │     │ sort_order    │
│ role         │     │ cover_url        │     │ is_active     │
│ created_at   │     │ address          │     │ created_at    │
│ updated_at   │     │ phone            │     │ updated_at    │
└──────────────┘     │ facebook_url     │     └──────────────┘
                     │ instagram_url    │            │
                     │ subscription_tier│            │ 1:N
                     │ sub_expires_at   │            ▼
                     │ is_active        │     ┌──────────────┐
                     │ created_at       │     │  menu_items  │
                     │ updated_at       │     ├──────────────┤
                     └──────────────────┘     │ id (PK)      │
                                              │ category_id  │
┌──────────────┐                              │ name         │
│  qr_codes    │                              │ description  │
├──────────────┤                              │ price        │
│ id (PK)      │                              │ image_url    │
│restaurant_id │                              │ is_available │
│ slug         │                              │ sort_order   │
│ qr_image_url │                              │ is_featured  │
│ qr_svg_url   │                              │ created_at   │
│ created_at   │                              │ updated_at   │
└──────────────┘                              └──────────────┘

┌──────────────────┐     ┌──────────────────┐
│  qr_analytics    │     │  subscriptions   │
├──────────────────┤     ├──────────────────┤
│ id (PK)          │     │ id (PK)          │
│ qr_code_id (FK)  │     │ restaurant_id    │
│ restaurant_id    │     │ tier             │
│ scanned_at       │     │ status           │
│ user_agent       │     │ amount           │
│ ip_address       │     │ started_at       │
│ device_type      │     │ expires_at       │
│ referrer         │     │ payment_method   │
└──────────────────┘     │ created_at       │
                         └──────────────────┘

┌──────────────────┐
│ password_resets  │
├──────────────────┤
│ id (PK)          │
│ user_id (FK)     │
│ token (unique)   │
│ expires_at       │
│ used             │
│ created_at       │
└──────────────────┘
```

### 5.2 Харилцаа

- **users** 1:N **restaurants** (нэг хэрэглэгч олон ресторан удирдаж болно)
- **restaurants** 1:N **categories**
- **categories** 1:N **menu_items**
- **restaurants** 1:N **qr_codes**
- **restaurants** 1:N **qr_analytics**
- **qr_codes** 1:N **qr_analytics**
- **restaurants** 1:N **subscriptions**

---

## 6. Prisma Schema

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ========================
// Auth & Users
// ========================
enum UserRole {
  SUPER_ADMIN
  RESTAURANT_OWNER
  RESTAURANT_STAFF
}

model User {
  id           String       @id @default(cuid())
  email        String       @unique
  passwordHash String       @map("password_hash")
  name         String
  phone        String?
  role         UserRole     @default(RESTAURANT_OWNER)
  isActive     Boolean      @default(true) @map("is_active")
  createdAt    DateTime     @default(now()) @map("created_at")
  updatedAt    DateTime     @updatedAt @map("updated_at")

  restaurants     Restaurant[]
  passwordResets  PasswordReset[]

  @@map("users")
}

model PasswordReset {
  id        String    @id @default(cuid())
  userId    String    @map("user_id")
  token     String    @unique
  expiresAt DateTime  @map("expires_at")
  used      Boolean   @default(false)
  createdAt DateTime  @default(now()) @map("created_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("password_resets")
}

// ========================
// Restaurant
// ========================
enum SubscriptionTier {
  STARTER
  PRO
  ENTERPRISE
}

model Restaurant {
  id               String           @id @default(cuid())
  userId           String           @map("user_id")
  name             String
  slug             String           @unique
  logoUrl          String?          @map("logo_url")
  coverUrl         String?          @map("cover_url")
  address          String?
  phone            String?
  facebookUrl      String?          @map("facebook_url")
  instagramUrl     String?          @map("instagram_url")
  subscriptionTier SubscriptionTier @default(STARTER) @map("subscription_tier")
  subExpiresAt     DateTime?        @map("sub_expires_at")
  isActive         Boolean          @default(true) @map("is_active")
  createdAt        DateTime         @default(now()) @map("created_at")
  updatedAt        DateTime         @updatedAt @map("updated_at")

  user          User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  categories    Category[]
  qrCodes       QrCode[]
  qrAnalytics   QrAnalytics[]
  subscriptions Subscription[]

  @@map("restaurants")
}

// ========================
// Menu
// ========================
model Category {
  id           String  @id @default(cuid())
  restaurantId String  @map("restaurant_id")
  name         String
  description  String?
  sortOrder    Int     @default(0) @map("sort_order")
  isActive     Boolean @default(true) @map("is_active")
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")

  restaurant Restaurant @relation(fields: [restaurantId], references: [id], onDelete: Cascade)
  menuItems  MenuItem[]

  @@map("categories")
}

model MenuItem {
  id          String   @id @default(cuid())
  categoryId  String   @map("category_id")
  name        String
  description String?
  price       Decimal  @db.Decimal(12, 2)
  imageUrl    String?  @map("image_url")
  isAvailable Boolean  @default(true) @map("is_available")
  sortOrder   Int      @default(0) @map("sort_order")
  isFeatured  Boolean  @default(false) @map("is_featured")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  category Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)

  @@map("menu_items")
}

// ========================
// QR Codes
// ========================
model QrCode {
  id           String   @id @default(cuid())
  restaurantId String   @map("restaurant_id")
  slug         String
  qrImageUrl   String?  @map("qr_image_url")
  qrSvgUrl     String?  @map("qr_svg_url")
  createdAt    DateTime @default(now()) @map("created_at")

  restaurant  Restaurant    @relation(fields: [restaurantId], references: [id], onDelete: Cascade)
  qrAnalytics QrAnalytics[]

  @@map("qr_codes")
}

// ========================
// Analytics
// ========================
model QrAnalytics {
  id           String   @id @default(cuid())
  qrCodeId     String   @map("qr_code_id")
  restaurantId String   @map("restaurant_id")
  scannedAt    DateTime @default(now()) @map("scanned_at")
  userAgent    String?  @map("user_agent")
  ipAddress    String?  @map("ip_address")
  deviceType   String?  @map("device_type")
  referrer     String?

  qrCode     QrCode     @relation(fields: [qrCodeId], references: [id], onDelete: Cascade)
  restaurant Restaurant @relation(fields: [restaurantId], references: [id], onDelete: Cascade)

  @@index([restaurantId, scannedAt])
  @@map("qr_analytics")
}

// ========================
// Subscriptions / Billing
// ========================
enum SubscriptionStatus {
  ACTIVE
  PAST_DUE
  CANCELLED
  EXPIRED
  TRIAL
}

model Subscription {
  id            String              @id @default(cuid())
  restaurantId  String              @map("restaurant_id")
  tier          SubscriptionTier
  status        SubscriptionStatus  @default(TRIAL)
  amount        Decimal             @db.Decimal(12, 2)
  startedAt     DateTime            @default(now()) @map("started_at")
  expiresAt     DateTime            @map("expires_at")
  paymentMethod String?             @map("payment_method")
  createdAt     DateTime            @default(now()) @map("created_at")

  restaurant Restaurant @relation(fields: [restaurantId], references: [id], onDelete: Cascade)

  @@map("subscriptions")
}
```

---

## 7. API Бүтэц

### 7.1 REST API Endpoints

```
Base URL: https://api.qrmenu.mn/api/v1

═══════════════════════════════════════════
AUTH
═══════════════════════════════════════════
POST   /auth/register          — Бүртгэл
POST   /auth/login             — Нэвтрэх (JWT)
POST   /auth/logout            — Гарах
POST   /auth/refresh           — Token шинэчлэх
POST   /auth/forgot-password   — Нууц үг сэргээх линк явуулах
POST   /auth/reset-password    — Нууц үг шинэчлэх
GET    /auth/me                — Одоогийн хэрэглэгчийн мэдээлэл

═══════════════════════════════════════════
RESTAURANTS (admin)
═══════════════════════════════════════════
GET    /restaurants                    — Миний ресторанууд
POST   /restaurants                    — Ресторан үүсгэх
GET    /restaurants/:slug              — Ресторан дэлгэрэнгүй
PATCH  /restaurants/:slug              — Ресторан засах
DELETE /restaurants/:slug              — Ресторан устгах
PATCH  /restaurants/:slug/logo         — Лого upload
PATCH  /restaurants/:slug/cover        — Ковер upload

═══════════════════════════════════════════
CATEGORIES (admin)
═══════════════════════════════════════════
GET    /restaurants/:slug/categories           — Ангилалууд
POST   /restaurants/:slug/categories           — Ангилал нэмэх
PATCH  /restaurants/:slug/categories/:id       — Ангилал засах
DELETE /restaurants/:slug/categories/:id       — Ангилал устгах
PATCH  /restaurants/:slug/categories/reorder   — Эрэмбэ солих

═══════════════════════════════════════════
MENU ITEMS (admin)
═══════════════════════════════════════════
GET    /restaurants/:slug/items                     — Бүх хоол
GET    /restaurants/:slug/items?categoryId=:cid     — Ангиллаар шүүх
POST   /restaurants/:slug/items                     — Хоол нэмэх
PATCH  /restaurants/:slug/items/:id                 — Хоол засах
DELETE /restaurants/:slug/items/:id                 — Хоол устгах
PATCH  /restaurants/:slug/items/:id/image           — Зураг upload
PATCH  /restaurants/:slug/items/:id/toggle          — Байгаа эсэх
PATCH  /restaurants/:slug/items/reorder             — Эрэмбэ солих

═══════════════════════════════════════════
QR CODES (admin)
═══════════════════════════════════════════
GET    /restaurants/:slug/qr-codes          — QR кодууд
POST   /restaurants/:slug/qr-codes          — QR код үүсгэх
GET    /restaurants/:slug/qr-codes/:id/png  — PNG татах
GET    /restaurants/:slug/qr-codes/:id/svg  — SVG татах
DELETE /restaurants/:slug/qr-codes/:id      — QR код устгах

═══════════════════════════════════════════
ANALYTICS (admin)
═══════════════════════════════════════════
GET    /restaurants/:slug/analytics              — Dashboard статистик
GET    /restaurants/:slug/analytics/scans        — QR уншуулалт
GET    /restaurants/:slug/analytics/scans/daily  — Өдрөөр
GET    /restaurants/:slug/analytics/scans/weekly — 7 хоногоор
GET    /restaurants/:slug/analytics/devices      — Төхөөрөмжөөр

═══════════════════════════════════════════
SUBSCRIPTIONS
═══════════════════════════════════════════
GET    /restaurants/:slug/subscription      — Захиалгын мэдээлэл
POST   /restaurants/:slug/subscription      — Шинэ захиалга
PATCH  /restaurants/:slug/subscription      — Багц солих / шинэчлэх
GET    /restaurants/:slug/invoices          — Нэхэмжлэлүүд

═══════════════════════════════════════════
PUBLIC (JWT шаардлагагүй)
═══════════════════════════════════════════
GET    /public/:slug                        — Рестораны нийтийн цэс
GET    /public/:slug/categories             — Ангилалууд
GET    /public/:slug/items                  — Бүх хоол
GET    /public/:slug/items?search=хонины    — Хайлт
GET    /public/:slug/items?categoryId=:cid  — Ангиллаар шүүх
POST   /public/:slug/scan                   — QR уншуулалт бүртгэх
```

### 7.2 API Response Format

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 156
  },
  "message": null
}
```

### 7.3 Error Response

```json
{
  "success": false,
  "data": null,
  "message": "Ангилал олдсонгүй",
  "errors": [
    {
      "field": "name",
      "message": "Нэр заавал оруулна уу"
    }
  ]
}
```

### 7.4 NestJS Module Structure

```
src/
├── app.module.ts
├── main.ts
├── common/
│   ├── decorators/        — @CurrentUser, @Public, @Roles
│   ├── guards/            — JwtAuthGuard, RolesGuard
│   ├── interceptors/      — TransformInterceptor, LoggingInterceptor
│   ├── filters/           — HttpExceptionFilter
│   └── pipes/             — ValidationPipe
├── config/
│   └── configuration.ts   — env config
├── prisma/
│   ├── prisma.module.ts
│   └── prisma.service.ts
├── auth/
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.dto.ts
│   └── strategies/
│       ├── jwt.strategy.ts
│       └── jwt-refresh.strategy.ts
├── users/
│   ├── users.module.ts
│   ├── users.service.ts
│   └── users.dto.ts
├── restaurants/
│   ├── restaurants.module.ts
│   ├── restaurants.controller.ts
│   ├── restaurants.service.ts
│   └── restaurants.dto.ts
├── categories/
│   ├── categories.module.ts
│   ├── categories.controller.ts
│   ├── categories.service.ts
│   └── categories.dto.ts
├── menu-items/
│   ├── menu-items.module.ts
│   ├── menu-items.controller.ts
│   ├── menu-items.service.ts
│   └── menu-items.dto.ts
├── qr-codes/
│   ├── qr-codes.module.ts
│   ├── qr-codes.controller.ts
│   ├── qr-codes.service.ts
│   └── qr-codes.dto.ts
├── analytics/
│   ├── analytics.module.ts
│   ├── analytics.controller.ts
│   ├── analytics.service.ts
│   └── analytics.dto.ts
├── subscriptions/
│   ├── subscriptions.module.ts
│   ├── subscriptions.controller.ts
│   ├── subscriptions.service.ts
│   └── subscriptions.dto.ts
├── public/
│   ├── public.module.ts
│   ├── public.controller.ts
│   └── public.service.ts
├── upload/
│   ├── upload.module.ts
│   ├── upload.controller.ts
│   └── upload.service.ts
└── mail/
    ├── mail.module.ts
    └── mail.service.ts
```

---

## 8. Folder Бүтэц

### 8.1 Monorepo Structure

```
qr-menu-mongolia/
├── docker-compose.yml
├── docker-compose.prod.yml
├── .env.example
├── .gitignore
├── README.md
├── LICENSE
│
├── backend/                          # NestJS
│   ├── package.json
│   ├── tsconfig.json
│   ├── nest-cli.json
│   ├── .env.example
│   ├── Dockerfile
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── src/
│   │   ├── main.ts
│   │   ├── app.module.ts
│   │   ├── common/
│   │   ├── config/
│   │   ├── prisma/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── restaurants/
│   │   ├── categories/
│   │   ├── menu-items/
│   │   ├── qr-codes/
│   │   ├── analytics/
│   │   ├── subscriptions/
│   │   ├── public/
│   │   ├── upload/
│   │   └── mail/
│   └── test/
│
├── frontend/                        # Next.js
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.js
│   ├── tailwind.config.ts
│   ├── .env.example
│   ├── Dockerfile
│   └── src/
│       ├── app/
│       │   ├── layout.tsx
│       │   ├── page.tsx             # Landing page
│       │   ├── (auth)/
│       │   │   ├── login/page.tsx
│       │   │   ├── register/page.tsx
│       │   │   └── forgot-password/page.tsx
│       │   ├── (dashboard)/
│       │   │   ├── layout.tsx
│       │   │   ├── dashboard/page.tsx
│       │   │   ├── categories/page.tsx
│       │   │   ├── menu/page.tsx
│       │   │   ├── qr-codes/page.tsx
│       │   │   ├── analytics/page.tsx
│       │   │   ├── settings/page.tsx
│       │   │   └── subscription/page.tsx
│       │   └── menu/[slug]/         # Нийтийн цэсний хуудас
│       │       └── page.tsx
│       ├── components/
│       │   ├── ui/                  # Shadcn/ui бүрдэл хэсгүүд
│       │   ├── forms/
│       │   ├── layout/
│       │   │   ├── Sidebar.tsx
│       │   │   ├── Header.tsx
│       │   │   └── DashboardLayout.tsx
│       │   ├── menu/
│       │   │   ├── MenuItemCard.tsx
│       │   │   ├── CategoryNav.tsx
│       │   │   └── MenuSearch.tsx
│       │   ├── restaurant/
│       │   │   ├── RestaurantInfo.tsx
│       │   │   └── RestaurantHero.tsx
│       │   └── qr/
│       │       ├── QrCodeCard.tsx
│       │       └── QrDownloadButtons.tsx
│       ├── hooks/
│       ├── lib/
│       │   ├── api.ts               # Axios instance
│       │   ├── auth.ts              # JWT helpers
│       │   └── utils.ts
│       ├── providers/
│       │   └── AuthProvider.tsx
│       └── types/
│           └── index.ts
│
└── docs/
    ├── MASTER_PLAN.md
    ├── API.md
    └── DEPLOYMENT.md
```

---

## 9. MVP Хувилбар

### 9.1 MVP Scope (4–6 долоо хоног)

**Оруулах:**

| Онцлог | Тайлбар | Тэргүүлэх |
|--------|---------|----------|
| Бүртгэл / Нэвтрэх | Email + нууц үг | P0 |
| Нууц үг сэргээх | Email-р token илгээх | P0 |
| Ресторан үүсгэх/засах | Нэр, slug, хаяг, утас, лого, ковер | P0 |
| Ангилал CRUD | Нэмэх, засах, устгах, эрэмбэлэх | P0 |
| Хоол CRUD | Нэр, үнэ, тайлбар, зураг, байгаа эсэх | P0 |
| QR код үүсгэх | Автоматаар URL → QR, PNG татах | P0 |
| Нийтийн цэсний хуудас | Mobile-first, ангилал + хайлт | P0 |
| Хандалтын тоолуур | QR уншуулалт бүртгэх | P1 |
| Админ dashboard | Нийт бүтээгдэхүүн, ангилал, QR тоо | P1 |
| Starter багц (үнэгүй trial) | 14 хоногийн үнэгүй туршилт | P1 |

**Оруулахгүй (MVP-ээс хойш):**

| Онцлог | Хэзээ |
|--------|------|
| Төлбөрийн систем (QPay/SocialPay) | 2-р сар |
| Багц солих / upgrade | 2-р сар |
| SVG QR татах | 2-р сар |
| Дэлгэрэнгүй аналитик | 2-р сар |
| Custom domain | 3-р сар |
| Нэмэлт админ хэрэглэгч | 3-р сар |
| Олон ресторан (нэг админаас) | 3-р сар |

### 9.2 MVP Технологийн Шийдвэр

| Компонент | Сонголт | Шалтгаан |
|----------|--------|---------|
| **Auth** | JWT (access + refresh token) | Стандарт, stateless |
| **Зураг upload** | Cloudinary | Үнэгүй tier (25GB), CDN, resize API |
| **QR код үүсгэлт** | qrcode (npm) | Сервер талд SVG/PNG үүсгэнэ |
| **Email** | Nodemailer + Gmail SMTP | Эхний шатанд хангалттай |
| **UI компонент** | Shadcn/ui + TailwindCSS | Хурдан, тохируулж болно |
| **Форм баталгаажуулалт** | React Hook Form + Zod | Төрөлтэй, хялбар |
| **HTTP Client** | Axios | Interceptor-ээр token refresh |
| **State** | React Context + React Query | Серверийн төлөвт тохиромжтой |

---

## 10. 3 Сарын Хөгжүүлэлтийн Төлөвлөгөө

### 10.1 1-р Сар: Суурь + MVP Core

| Долоо хоног | Backend | Frontend | Онцлох |
|------------|---------|----------|--------|
| **1** | NestJS scaffold, Prisma, Auth модуль | Next.js scaffold, TailwindCSS, Shadcn/ui | Project setup, Docker |
| **2** | Users модуль, Register/Login API | Login/Register хуудас, AuthProvider | JWT flow бүрэн |
| **3** | Restaurants, Categories CRUD API | Ресторан тохиргоо, ангилал удирдах | Admin panel эхлэл |
| **4** | Menu Items CRUD, QR код үүсгэлт | Цэс удирдах, QR код хуудас | **MVP Alpha** |

### 10.2 2-р Сар: MVP Бүрэн + Төлбөр

| Долоо хоног | Backend | Frontend | Онцлох |
|------------|---------|----------|--------|
| **1** | Public API (нийтийн цэс), Analytics | Нийтийн цэсний хуудас (mobile-first) | **MVP Beta амьд** |
| **2** | Subscriptions модуль, Trial логик | Dashboard, захиалгын хуудас | Тест хэрэглэгчид |
| **3** | Төлбөрийн интеграц (QPay API) | Төлбөрийн flow, invoice | Төлбөртэй болгох |
| **4** | Bug fix, performance, SEO | Responsive туршилт, алдаа засвар | **MVP Launch** 🚀 |

### 10.3 3-р Сар: Сайжруулалт + Өсөлт

| Долоо хоног | Backend | Frontend | Онцлох |
|------------|---------|----------|--------|
| **1** | Дэлгэрэнгүй аналитик, export | Аналитик dashboard сайжруулах | Pro багцад |
| **2** | Custom domain, нэмэлт админ | Custom domain setup UI | Enterprise багц |
| **3** | Олон ресторан, performance tuning | Олон ресторан солих UI | Power users |
| **4** | API документац, developer tools | Landing page сайжруулах, onboarding | v1.5 Launch |

---

## 11. 100 Ресторантай Болох Маркетингийн Төлөвлөгөө

### 11.1 Хэрэглэгч Төрөл (Personas)

| Persona | Хэрэгцээ | Хаана хүрэх вэ |
|---------|---------|---------------|
| **Кафе эзэн (25-35)** | Загварлаг, хурдан, хямд | Instagram, Facebook |
| **Ресторан эзэн (35-55)** | Найдвартай, үйлчилгээтэй | Facebook groups, шууд борлуулалт |
| **Кофе шоп (20-30)** | Minimal, орчин үеийн | Instagram, TikTok |
| **Паб/Лоунж (25-40)** | Хялбар, шөнийн хэрэглээ | Facebook event, influencer |

### 11.2 12 Сарын Маркетингийн Стратеги

#### Phase 1: Launch (0—3 сар) — 25 ресторан

| Сувгууд | Сар 1 | Сар 2 | Сар 3 |
|---------|-------|-------|-------|
| **Шууд борлуулалт** | 10 meeting/долоо хоног | 10 meeting/долоо хоног | 15 meeting/долоо хоног |
| **FB Lead Ads** | ₮200,000 | ₮300,000 | ₮400,000 |
| **Instagram content** | 3 постер/7 хоног | 5 постер/7 хоног | 7 постер/7 хоног |
| **Реферал хөтөлбөр** | — | 1 сар үнэгүй/referral | Үргэлжлүүлэх |
| **Зорилтот харилцагч** | 5 | 12 | 25 |

#### Phase 2: Өсөлт (4—8 сар) — +50 ресторан

| Сувгууд | Сар 4-6 | Сар 7-8 |
|---------|---------|---------|
| **FB/IG Conversion Ads** | ₮500,000/сар | ₮700,000/сар |
| **Google Ads (keyword)** | ₮200,000/сар | ₮300,000/сар |
| **Influencer хамтын ажиллагаа** | 2 сард | 3 сард |
| **Хоолны фестиваль, expo** | 1 оролцоо | 1 оролцоо |
| **Partnership (POS, ханган нийлүүлэгч)** | 2 түнш | 4 түнш |
| **Зорилтот харилцагч** | 50 | 75 |

#### Phase 3: Тогтворшил (9—12 сар) — +25 ресторан

| Сувгууд | Сар 9-12 |
|---------|----------|
| **FB Retargeting Ads** | ₮800,000/сар |
| **SEO + Content Marketing** | Блог (7 хоногт 1) |
| **Аймгийн зах зээл** | Дархан, Эрдэнэт, Хөвсгөл |
| **Бизнес networking** | Startup уулзалт, танхимын арга хэмжээ |
| **Зорилтот харилцагч** | 100 |

### 11.3 Реферал Хөтөлбөр

```
Реферал хөтөлбөр:
- Одоо байгаа харилцагч шинэ ресторан урихад:
  → Урьсан тал: 1 сар үнэгүй
  → Шинэ тал: 1 сар үнэгүй trial
- Хэрэгжүүлэх: Админ самбарт "Найзаа урих" товч
```

### 11.4 Онбординг Процесс

1. **Бүртгэл** → 14 хоног үнэгүй (credit card шаардлагагүй)
2. **Welcome email** → Видео заавар (2 мин)
3. **Автомат setup wizard** → 5 минутын дотор QR цэс амьд
4. **3 дахь өдөр** → Email: "QR цэсээ хэрхэн илүү үр дүнтэй ашиглах вэ?"
5. **7 дахь өдөр** → Email: "Танай QR цэсний статистик"
6. **12 дахь өдөр** → Email: "Туршилтын хугацаа дуусахад 2 хоног үлдлээ"
7. **14 дэх өдөр** → Төлбөрт шилжих санал

---

## 12. Facebook Зар Сурталчилгааны Стратеги

### 12.1 Зарны Campaign Бүтэц

```
Facebook Ads Account
├── 🎯 Campaign: Lead Generation
│   ├── Ad Set: УБ Ресторан Эзэд
│   ├── Ad Set: УБ Кафе Эзэд
│   └── Ad Set: Аймгийн F&B
│
├── 🎯 Campaign: Conversion (бүртгэл)
│   ├── Ad Set: FB/IG Feed
│   ├── Ad Set: FB/IG Story
│   └── Ad Set: Retargeting (вэб сайтад зочилсон)
│
└── 🎯 Campaign: Brand Awareness
    ├── Ad Set: Lookalike (одоогийн харилцагчид)
    └── Ad Set: Broad (Монгол, 22-55 нас)
```

### 12.2 Зарны Зардал ба Төсөв

| Зарны төрөл | Зардал/lead | Зардал/conversion | Сарын төсөв |
|------------|------------|------------------|-----------|
| Lead Ads (FB Form) | ₮3,000-5,000 | — | ₮200,000 |
| Conversion Ads | ₮8,000-15,000 | ₮15,000-25,000 | ₮300,000 |
| Retargeting | ₮2,000-4,000 | ₮8,000-12,000 | ₮150,000 |
| Brand Awareness | ₮500-1,000 CPM | — | ₮150,000 |

### 12.3 Ad Creative Жишээ

**Ad 1: Асуудал шийдэл**
```
Зураг: [Ресторанд хуучин цаасан цэс] vs [QR Menu Mongolia дэлгэц]

Гарчиг: Цаасан цэсний зардлаа 90% бууруул

Тайлбар: QR кодоор цэсээ дижитал болгоод, 
хэзээ ч хэвлэх шаардлагагүй. Өөрчлөлтийг 1 минутад хийнэ.

🚀 14 хоног үнэгүй турших
📱 Гар утсанд төгс харагддаг
🇲🇳 100% Монгол хэл дээр

👉 [Туршиж үзэх] товч
```

**Ad 2: Social proof**
```
Зураг: [Бодит рестораны QR цэсний скриншот 3-5]

Гарчиг: 25+ ресторан QR Menu Mongolia-г сонгосон

Тайлбар: Монголын шилдэг ресторанууд аль хэдийн 
QR цэсээ бидэнтэй хамт дижитал болголоо.

⭐ 4.8/5 үнэлгээ
💰 ₮29,000/сараас эхэлнэ
🎯 Setup 5 минут

👉 [Бүртгүүлэх] товч
```

**Ad 3: Видео demo**
```
Видео: [15 секунд — QR скан → цэс харагдах → хоол нэмэх]

Гарчиг: Таны цэс 5 минутад онлайн болно

Тайлбар: Админ самбараас цэсээ удирдаад, 
QR кодоор харилцагчиддаа хүргэ.

🔍 Хайлт + шүүлт
📊 Статистик
🖼️ Зурагтай хоол
🔄 Шуурхай шинэчлэлт

👉 [Үнэгүй эхлэх] товч
```

### 12.4 Target Audience

| Аудиенс | Тохиргоо |
|---------|---------|
| **Ресторан эзэд** | 25-55 нас, UB + аймаг, сонирхол: Restaurant management, Hospitality |
| **Кафе эзэд** | 22-45 нас, UB, сонирхол: Coffee shop, Cafe business |
| **F&B Manager** | 25-45 нас, Монгол, job title: Restaurant manager |
| **Retargeting** | Website visitors (30 days), FB page engagers |
| **Lookalike 1%** | Одоогийн харилцагчдын жагсаалтаас |

### 12.5 Conversion Flow

```
FB/IG Зар
    ↓
Landing Page (qrmenu.mn)
    ↓
Бүртгэлийн форм (нэр, имэйл, утас)
    ↓
Шууд админ самбар руу (автомат login)
    ↓
Setup Wizard (5 алхам)
    ↓
QR цэс амьд 🔥
    ↓
14 хоногийн trial эхэллээ
```

---

## 13. Борлуулалтын Скрипт

### 13.1 Хүйтэн Дуудлага / Messenger

```
──────────────────────────────────────────────
САЙН БАЙНА УУ? [Ресторан/Кафе нэр] уу?
──────────────────────────────────────────────

Сайн байна уу? Би QR Menu Mongolia-с Боро гэдэг.
Танай ресторанд зориулж QR кодтой дижитал цэсний
шинэ шийдэл санал болгох гэсэн юм.

📱 Гар утсаар цэс хардаг
✏️ Админ самбараас өөрөө засдаг
💰 ₮29,000/сараас эхэлнэ

Цаг гаргавал 5 минут тайлбарлая даа.
```

### 13.2 Уулзалтын Скрипт

```
──────────────────────────────────────────────
1. МЭНДЧИЛГЭЭ + ХАЛААЛТ (2 мин)
──────────────────────────────────────────────

"Сайн байна уу, [Нэр] захирал. Цаг гаргасанд баярлалаа.
Би QR Menu Mongolia-с Боро гэдэг.

Танайх одоо цэсээ хэрхэн харуулдаг вэ? 
Хэвлэмэл цэс үү? PDF уу?"

→ [Тэдний одоогийн байдлыг сонсох]
→ [Өвдөлтийн цэгийг олох]

──────────────────────────────────────────────
2. АСУУДАЛ ТОДОРХОЙЛОХ (3 мин)
──────────────────────────────────────────────

"Та нар цэсээ солих болгондоо хэвлэхэд хэдэн 
төгрөг зарцуулдаг вэ?"

"Харилцагчид танай цэсийг харах гэж хэр удаан 
хүлээдэг вэ? Хангалттай цэс байдаг уу?"

"COVID-оос хойш хүмүүс нэг цэс барьж үзэхээс 
илүү өөрийн утсаар харахыг хүсдэг болсон..."

──────────────────────────────────────────────
3. ШИЙДЭЛ ТАНИЛЦУУЛАХ (3 мин)
──────────────────────────────────────────────

→ [Утсаар demo харуулах — бодит QR скан]

"Энэ QR кодыг уншуулаад үз дээ."

→ [Тэд өөрсдөө скан хийж үзэх]

"Одоо би админ самбараас энэ кофены үнийг 
өөрчилье... За, refresh хийгээд үз"

→ [Шуурхай өөрчлөлтийг харуулах]

──────────────────────────────────────────────
4. ҮНЭ ЦЭНЭ (2 мин)
──────────────────────────────────────────────

"Бид 3 багцтай:
🥉 Starter — ₮29,000/сар (50 хүртэл хоол)
🥈 Pro — ₮49,000/сар (200 хүртэл хоол, аналитик)
🥇 Enterprise — ₮79,000/сар (хязгааргүй, бүх боломж)

Танайх ямар багц тохирох вэ?"

"Эхний 14 хоног бүрэн үнэгүй. 
Кредит карт ч хэрэггүй."

──────────────────────────────────────────────
5. СЭРГЭЭЛЭЛ БОЛОВСРУУЛАЛТ (3 мин)
──────────────────────────────────────────────

Эсэргүүцэл: "Манайх цаасан цэсэндээ дуртай"
→ "Ойлгож байна. Гэхдээ олон газар QR-г 
нэмэлт болгож ашигладаг. Цаасан цэстэй зэрэгцүүлээд 
ширээн дээр QR sticker наахад л болно."

Эсэргүүцэл: "Үнэтэй байна"
→ "Одоо цэс хэвлэхэд сард хэдэн төгрөг 
зарцуулдаг вэ? Ихэвчлэн ₮50,000-100,000. 
Манай Starter ₮29,000. Хямд, бас шуурхай."

Эсэргүүцэл: "Хэрэглэгчид ашиглахгүй"
→ "Та өөрөө сая утсаар харсан. Бүх Монгол залуучууд 
QR-г мэддэг. Төлбөр төлөхөд QPay ашигладаг шиг."

Эсэргүүцэл: "Дахиад бодъё"
→ "Мэдээж. Харин 14 хоног үнэгүй trial-д 
бүртгүүлчихье. Төлбөргүй, таалагдахгүй бол болино."

──────────────────────────────────────────────
6. ХААЛТ (2 мин)
──────────────────────────────────────────────

"Тэгэхээр одоо бүртгүүлэх үү? 
Би 5 минутад тохируулаад өгье."

Хэрэв тийм:
→ Утсаар эсвэл таблетаар бүртгүүлэх
→ Рестораны нэр, ангилал, эхний 5 хоол оруулах
→ QR код үүсгэх
→ "Ингээд таны QR цэс амьд боллоо! 🎉"

Хэрэв үгүй:
→ "За, [Нэр] захирал. Маргааш орой дахин 
холбогдоод бодсоноо сонсъё."
→ FB Messenger холбоо тогтоох
→ Маргааш дахин мессеж бичих

──────────────────────────────────────────────
7. ДАГАЛТ (Маргааш)
──────────────────────────────────────────────

"Сайн байна уу [Нэр] захирал. QR цэсний 
талаар бодож амжив уу? Асуух зүйл байвал 
хариулахад бэлэн байна."

Хариу ирээгүй бол 3 хоногийн дараа:
"Сайн уу [Нэр]. Хэрэггүй бол 'хэрэггүй' гэж
бичээрэй, би дахиж төвөг удахгүй 🙂 
Харин сонирхолтой бол 14 хоног үнэгүй 
турших боломжийг сануулъя."
```

### 13.3 Борлуулалтын KPI

| Үзүүлэлт | Зорилт |
|----------|--------|
| Мессеж илгээлт/долоо хоног | 50 |
| Хариу ирэх хувь | 25-30% |
| Уулзалт товлох хувь | 10-15% |
| Уулзалт → Trial | 50-60% |
| Trial → Төлбөрт | 60-70% |
| Харилцагч авах зардал (CAC) | ₮15,000-25,000 |

### 13.4 Automation Stack

```
Хүйтэн outreach → ManyChat / Meta Business Suite
CRM → Google Sheets (эхлээд) → HubSpot (дараа)
Имэйл автоматизаци → SendGrid
Мессеж автоматизаци → ManyChat
```

---

## Хавсралт: Технологийн Stack Дэлгэрэнгүй

### Backend (NestJS)

```json
{
  "dependencies": {
    "@nestjs/common": "^10.x",
    "@nestjs/core": "^10.x",
    "@nestjs/platform-express": "^10.x",
    "@nestjs/jwt": "^10.x",
    "@nestjs/passport": "^10.x",
    "@prisma/client": "^5.x",
    "passport": "^0.7.x",
    "passport-jwt": "^4.x",
    "bcryptjs": "^2.x",
    "class-validator": "^0.14.x",
    "class-transformer": "^0.5.x",
    "qrcode": "^1.x",
    "cloudinary": "^2.x",
    "nodemailer": "^6.x",
    "helmet": "^7.x",
    "compression": "^1.x"
  },
  "devDependencies": {
    "prisma": "^5.x",
    "@types/qrcode": "^1.x",
    "@types/bcryptjs": "^2.x",
    "@types/nodemailer": "^6.x",
    "jest": "^29.x",
    "supertest": "^6.x"
  }
}
```

### Frontend (Next.js)

```json
{
  "dependencies": {
    "next": "^14.x",
    "react": "^18.x",
    "react-dom": "^18.x",
    "@tanstack/react-query": "^5.x",
    "axios": "^1.x",
    "react-hook-form": "^7.x",
    "zod": "^3.x",
    "@hookform/resolvers": "^3.x",
    "lucide-react": "^0.x",
    "clsx": "^2.x",
    "tailwind-merge": "^2.x",
    "recharts": "^2.x",
    "date-fns": "^3.x"
  },
  "devDependencies": {
    "typescript": "^5.x",
    "tailwindcss": "^3.x",
    "@types/react": "^18.x",
    "eslint": "^8.x",
    "prettier": "^3.x"
  }
}
```

### Deployment (Docker)

```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: qr_menu_mongolia
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - pgdata:/var/lib/postgresql/data
    restart: always

  backend:
    build: ./backend
    environment:
      DATABASE_URL: postgresql://${DB_USER}:${DB_PASSWORD}@postgres:5432/qr_menu_mongolia
      JWT_SECRET: ${JWT_SECRET}
      CLOUDINARY_URL: ${CLOUDINARY_URL}
    depends_on:
      - postgres
    restart: always

  frontend:
    build: ./frontend
    environment:
      NEXT_PUBLIC_API_URL: https://api.qrmenu.mn
    depends_on:
      - backend
    restart: always

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - backend

volumes:
  pgdata:
```

### VPS Тохиргоо (Contabo / Hetzner)

| Үзүүлэлт | Санал болгох |
|----------|-------------|
| vCPU | 2-4 core |
| RAM | 4-8 GB |
| SSD | 50-100 GB NVMe |
| OS | Ubuntu 22.04 LTS |
| Bandwidth | 100 Mbit/s+ |
| Үнэ | ~$10-25/сар (Contabo) |

---

> **Дүгнэлт:** QR Menu Mongolia бол Монголын F&B зах зээлд тодорхой 
> өрсөлдөх давуу талтай, боломжийн зардлаар эхлүүлж болох SaaS бизнес юм.  
> Эхний 3 сард MVP бэлэн болгож, 12 сарын дотор 100+ ресторан харилцагчтай 
> болох бодит боломжтой.
>
> **Нийт startup зардал:** ~₮2,000,000–3,000,000 (VPS + domain + маркетинг эхний 3 сар)  
> **Break-even:** ~20 харилцагч буюу 3-р сар  
> **Жилийн таамагласан цэвэр ашиг:** ~₮20 сая
>
> — AutoBoro ⚡ | 2026-06-23

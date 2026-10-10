# Aurelle Cabs — Customer Website

The public website for Aurelle Cabs: one-way and outstation taxi booking across Tamil Nadu, service packages (wedding, corporate, hourly), customer accounts, support tickets, district guides and the blog.

The staff-facing admin console is a **separate project** (`aurelle-admin`). Both projects use the same MongoDB database, so bookings made here appear in the admin console and admin changes (prices, districts, blog posts, FAQs) appear here.

## Tech stack

- Next.js 14 (App Router) · React 18 · TypeScript
- Tailwind CSS · Framer Motion · GSAP · Lenis smooth scrolling
- MongoDB via Mongoose

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev                  # http://localhost:3000
```

| Script              | What it does                         |
| ------------------- | ------------------------------------ |
| `npm run dev`       | Development server on port 3000      |
| `npm run build`     | Production build (lint + type check) |
| `npm start`         | Serve the production build           |
| `npm run lint`      | ESLint                               |
| `npm run typecheck` | TypeScript check only                |
| `npm run format`    | Prettier on `src/`                   |

## Environment variables

| Variable                    | Required | Description                                                                                     |
| --------------------------- | -------- | ----------------------------------------------------------------------------------------------- |
| `MONGODB_URI`               | Yes      | MongoDB connection string. Same database as the admin console.                                  |
| `JWT_SECRET`                | Yes      | Signs customer login tokens. Long random string, **different** from the admin console's secret. |
| `MONGODB_TLS_ALLOW_INVALID` | No       | `true` only if a corporate proxy re-signs TLS traffic. Default `false`.                         |

If `MONGODB_URI` is missing or the database is unreachable, the site keeps working on an **in-memory demo store** (`src/lib/memoryStore.ts`). Demo data is lost on restart and is not shared with the admin console.

## Project structure

```
src/
├── app/
│   ├── page.tsx                  Home page (all marketing sections + support buttons)
│   ├── blog/                     Blog listing and article pages
│   ├── district/[id]/            District travel guide pages
│   ├── privacy-policy/           Legal pages (content editable via CMS)
│   ├── terms-and-conditions/
│   └── api/                      Customer-facing API routes (see below)
├── components/
│   ├── providers/                App-wide providers + global modals, Lenis scrolling
│   ├── sections/                 Home page sections (Hero, Fleet, Services, FAQ, Footer, ...)
│   └── ui/                       Drawers and modals (booking, tariff, auth, account, support, chat)
├── context/
│   ├── BookingContext.tsx        Trip planner state, fare calculation, booking submission
│   └── CustomerAuthContext.tsx   Customer session, profile and "my bookings"
├── data/                         Default content used for first-run seeding and offline mode
├── hooks/                        Scroll-reveal animation hook
└── lib/
    ├── api.ts                    JSON response helpers + customer session lookup (server)
    ├── apiClient.ts              fetch wrapper that attaches the customer token (browser)
    ├── auth.ts                   Password hashing and JWT signing/verification
    ├── db.ts                     Cached MongoDB connection
    ├── models.ts                 Mongoose schemas (kept identical in both projects)
    ├── memoryStore.ts            Offline/demo data store
    └── site.ts                   Public contact details
```

## API routes

| Route                         | Methods   | Auth           | Purpose                                                      |
| ----------------------------- | --------- | -------------- | ------------------------------------------------------------ |
| `/api/auth/customer/register` | POST      | —              | Create an account, returns a 30-day token                    |
| `/api/auth/customer/login`    | POST      | —              | Sign in with email or phone                                  |
| `/api/auth/customer/me`       | GET, PUT  | Customer token | Own profile + bookings; update own profile                   |
| `/api/bookings`               | POST      | Optional       | Create a booking (linked to the account when signed in)      |
| `/api/bookings`               | PUT       | Customer token | Cancel **own** booking (`status: "Cancelled"` only)          |
| `/api/support`                | GET       | See note       | `?ticketId=` lookup, or own tickets when signed in           |
| `/api/support`                | POST      | Optional       | `create_ticket` or `add_message` (always sent as customer)   |
| `/api/fleet`                  | GET       | —              | Vehicles and per-km pricing                                  |
| `/api/districts`, `/[id]`     | GET       | —              | District guides                                              |
| `/api/blogs`, `/[slug]`       | GET       | —              | Published posts (article view increments the view counter)  |
| `/api/services`               | GET       | —              | Active service packages                                      |
| `/api/cms?type=`              | GET       | —              | FAQ, privacy policy, terms                                   |

Customers can only create bookings with customer fields. Status, driver assignment and admin notes are always set by the admin console.

## Notes for maintainers

- `src/lib/models.ts`, `auth.ts`, `db.ts` and the files in `src/data/` also exist in the admin project. When you change a schema, change it in **both** projects.
- `/privacy` and `/terms` permanently redirect to the full legal page URLs.
- Customer tokens are signed with this project's `JWT_SECRET`. Changing it signs every customer out; they simply log in again.

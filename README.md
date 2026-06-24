# 🌿 Campus Wellness

A role-based wellness tracker for students. Log daily moods and habits, book sessions with campus wellness professionals, browse curated resources, and watch your trends over time — all in one clean, responsive app.

<p>
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-14-000000?logo=next.js&logoColor=white" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" />
  <img alt="Prisma" src="https://img.shields.io/badge/Prisma-5-2D3748?logo=prisma&logoColor=white" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-3-38BDF8?logo=tailwindcss&logoColor=white" />
  <img alt="SQLite" src="https://img.shields.io/badge/SQLite-bundled-003B57?logo=sqlite&logoColor=white" />
  <img alt="License" src="https://img.shields.io/badge/license-MIT-green" />
</p>

---

## ✨ Features

**Students**
- Daily mood check-in (mood, stress, and sleep on a 1–5 scale) with notes
- Habit tracker with one-tap completion and progress bar
- Appointment booking with status tracking (pending → approved/rejected)
- Searchable wellness resource library
- Personal analytics: mood trend, habit completion, and stress breakdown
- Activity-based notifications and a rule-based daily suggestion

**Professionals**
- Dashboard with today's schedule and pending-request count
- Appointment request queue with each student's average mood for quick triage
- One-click approve / reject (which notifies the student automatically)

**Admins**
- Platform overview: totals, appointment-status breakdown, newest accounts

**Under the hood**
- Three roles share a single `User` table and extend it 1-to-1
- Passwords hashed with **scrypt** (Node's built-in `crypto` — no native deps)
- **Server-side sessions** stored in the database, referenced by an httpOnly cookie
- All mutations run through **Server Actions** with ownership checks (no trusting client-sent IDs)
- Role-based route protection enforced in server layouts

---

## 🧱 Tech stack

| Layer       | Choice                                              |
| ----------- | --------------------------------------------------- |
| Framework   | Next.js 14 (App Router, Server Components + Actions) |
| Language    | TypeScript                                          |
| Styling     | Tailwind CSS + a small custom component library     |
| Database    | SQLite via Prisma ORM                               |
| Charts      | Recharts                                            |
| Icons       | lucide-react                                        |

SQLite keeps the project **clone-and-run** — there's no external database server to install.

---

## 🚀 Getting started

**Prerequisites:** Node.js 18+.

```bash
# 1. install dependencies
npm install

# 2. create the .env file
cp .env.example .env

# 3. create the database schema and seed demo data
npm run setup

# 4. start the dev server
npm run dev
```

Open **http://localhost:3000** and sign in with one of the demo accounts below.

### Useful scripts

| Script             | What it does                                       |
| ------------------ | -------------------------------------------------- |
| `npm run dev`      | Start the dev server                               |
| `npm run build`    | Generate the Prisma client and build for production |
| `npm run setup`    | `prisma db push` + seed                            |
| `npm run db:reset` | Wipe and reseed the database                       |
| `npm run db:studio`| Open Prisma Studio to browse the data              |

---

## 🔑 Demo accounts

All demo accounts use the password **`demo123`**.

| Role         | Email                    | Notes                                  |
| ------------ | ------------------------ | -------------------------------------- |
| Student      | `sarah@std.edu`          | Pre-seeded with a week of mood + habit data |
| Student      | `james@std.edu`          | Has an approved appointment            |
| Professional | `dr.rahman@wellness.edu` | Counseling — has pending requests      |
| Professional | `dr.park@wellness.edu`   | Campus physician                       |
| Admin        | `admin@campus.edu`       | Platform overview                      |

> The login screen also has one-tap buttons that fill in each demo account for you.

---

## 📁 Project structure

```
campus-wellness/
├── prisma/
│   ├── schema.prisma        # data model
│   └── seed.ts              # demo data
├── src/
│   ├── app/
│   │   ├── login/ signup/   # auth pages
│   │   ├── api/auth/        # login / signup / logout route handlers
│   │   ├── student/         # student dashboard, mood, habits, …
│   │   ├── professional/    # professional dashboard + request queue
│   │   └── admin/           # admin overview
│   ├── components/          # UI library, shell, forms, charts
│   └── lib/
│       ├── auth.ts          # sessions + role guards
│       ├── password.ts      # scrypt hashing
│       ├── prisma.ts        # Prisma client singleton
│       ├── constants.ts     # nav, labels, suggestion engine
│       └── actions/         # server actions (mood, habits, appointments…)
└── …config
```

---

## 🗃️ Data model

A single `User` holds shared identity (name, email, `passwordHash`, role). `Student`, `Professional`, and `Admin` extend it 1-to-1. `MoodLog` and `HabitLog` belong to a student; `Appointment` links a student and a professional with a status field; `Resource` and `Notification` round it out. See [`prisma/schema.prisma`](prisma/schema.prisma) for the full schema.

---

## 🖼️ Screenshots

> Add screenshots of the dashboard, analytics, and professional queue to a `docs/` folder and embed them here — they make the repo much more inviting.

---

## 🔒 A note on authentication

This is a portfolio/demo project. Auth is real enough to be meaningful — passwords are hashed with scrypt, sessions live in the database, and the cookie is httpOnly — but it intentionally skips production concerns like email verification, password reset, rate limiting, and CSRF tokens. The focus is on clean full-stack architecture rather than a hardened auth system.

---

## 📄 License

MIT — see [LICENSE](LICENSE).

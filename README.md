# Jharkhand Societal Innovation Collaboration Portal

A centralized **NEP 2020** platform connecting citizen societal challenges across Jharkhand's 24 districts with universities (HEIs), researchers, industry partners (CSR), and government departments for innovation-driven solutions.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19 · TypeScript · TailwindCSS v4 · Framer Motion · D3.js · Lucide Icons |
| **Backend** | Express.js · TypeScript · Modular route/service architecture |
| **Database** | PostgreSQL (Supabase) via Prisma ORM |
| **AI** | Google Gemini 3.6 Flash (problem analysis, proposal generation) |
| **Auth** | JWT + bcryptjs (with dev-mode bypass) |
| **Validation** | Zod v4 |
| **Build** | Vite + esbuild · tsx (dev runtime) |

## Features

- **Citizen Module** — Submit societal challenges with voice input, geolocation, and photo attachments
- **AI Problem Triage** — Gemini-powered classification, HEI matching, and duplicate detection
- **University Module** — HEI dashboard, problem assignment, proposal submission, milestone tracking
- **Industry Module** — CSR partnership, funding pledges, mentorship offers
- **Project Lifecycle** — Stage-gate workflow from ideation to deployment
- **Analytics Dashboard** — District-level stats, domain distribution, D3 visualizations
- **Communication Hub** — Discussion threads per problem, notifications panel
- **Jharkhand Map** — Interactive district visualization

## Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env and add your GEMINI_API_KEY
   ```

3. **Set up the database**:
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── server.ts                    # Express entry point (dev: tsx, prod: esbuild)
├── src/
│   ├── App.tsx                  # Root React component with tab routing
│   ├── main.tsx                 # React DOM entry
│   ├── index.css                # TailwindCSS + editorial theme tokens
│   ├── types.ts                 # Shared TypeScript interfaces
│   ├── data/
│   │   └── jharkhandData.ts     # Seed data (universities, problems, partners)
│   └── components/
│       ├── Navbar.tsx
│       ├── CitizenModule.tsx
│       ├── CitizenSubmissionModal.tsx
│       ├── AIProblemManagement.tsx
│       ├── UniversityModule.tsx
│       ├── IndustryModule.tsx
│       ├── ProjectLifecycleView.tsx
│       ├── AnalyticsDashboard.tsx
│       ├── ProblemDetailsModal.tsx
│       ├── CommunicationHub.tsx
│       ├── DiscussionThread.tsx
│       ├── NotificationPanel.tsx
│       └── JharkhandMap.tsx
├── server/
│   ├── config/
│   │   ├── db.ts                # Prisma singleton client
│   │   └── env.ts               # Environment variable config
│   ├── middleware/
│   │   ├── auth.ts              # JWT authentication + role guard
│   │   ├── errorHandler.ts      # Global error handler
│   │   ├── rateLimiter.ts       # In-memory rate limiter
│   │   └── validate.ts          # Zod request validation
│   ├── modules/
│   │   ├── auth/                # Registration, login, JWT
│   │   ├── problems/            # CRUD, search, status updates
│   │   ├── ai/                  # Gemini analysis + proposal gen
│   │   ├── universities/        # HEI management
│   │   ├── industry/            # Partner management + pledges
│   │   ├── proposals/           # Solution proposals + milestones
│   │   ├── discussions/         # Threaded messages per problem
│   │   ├── analytics/           # Summary aggregation
│   │   └── health/              # Health check endpoint
│   └── utils/
│       ├── apiResponse.ts       # Standardized API response wrapper
│       ├── gemini.ts            # Gemini client singleton
│       └── logger.ts            # Structured logging
├── prisma/
│   ├── schema.prisma            # Full relational schema (PostgreSQL)
│   └── seed.ts                  # Database seed from jharkhandData
├── .env.example                 # Environment variable template
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/problems` | List problems (with filters) |
| `GET` | `/api/problems/:id` | Get problem by ID or tracking code |
| `POST` | `/api/problems` | Submit new problem |
| `POST` | `/api/problems/:id/upvote` | Upvote a problem |
| `POST` | `/api/problems/:id/assign` | Assign problem to HEI |
| `PATCH` | `/api/problems/:id/status` | Update problem status |
| `GET` | `/api/universities` | List all universities |
| `GET` | `/api/industry/partners` | List industry partners |
| `POST` | `/api/industry/pledge` | Pledge funding |
| `GET` | `/api/proposals` | List proposals |
| `POST` | `/api/proposals` | Submit proposal |
| `PATCH` | `/api/proposals/:id/milestone` | Update milestone |
| `POST` | `/api/ai/analyze-problem` | AI problem analysis |
| `POST` | `/api/ai/generate-proposal` | AI proposal generation |
| `GET` | `/api/discussions/:problemId` | Get discussion messages |
| `POST` | `/api/discussions` | Post discussion message |
| `POST` | `/api/auth/register` | Register user |
| `POST` | `/api/auth/login` | Login |
| `GET` | `/api/auth/me` | Get current user |
| `GET` | `/api/analytics` | Analytics summary |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build for production (Vite + esbuild) |
| `npm start` | Run production build |
| `npm run lint` | TypeScript type checking |
| `npm run clean` | Remove build artifacts |

## License

© Department of Higher & Technical Education, Government of Jharkhand.

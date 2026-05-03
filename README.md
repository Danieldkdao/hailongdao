# DaoMath

DaoMath is a Next.js application for collecting, publishing, discussing, and curating short problems in commutative algebra. The public site is built around a searchable problem feed, individual problem pages with Markdown and LaTeX rendering, voting, comments, and an about page that explains the purpose of the collection.

The private admin area lets approved contributors create and manage problems, while administrators can review all problems and manage user accounts. Authentication is powered by Better Auth with email/password, email OTP verification, GitHub login, Google login, and role-based permissions.

## What This App Does

- Publishes a curated library of commutative algebra problems.
- Lets visitors search, sort, and filter problems by text, difficulty, status, popularity, comments, likes, and age.
- Shows problem detail pages with author information, difficulty, status, keywords, view counts, vote counts, and rendered Markdown/LaTeX content.
- Supports community activity through comments, comment sorting, and comment voting.
- Lets signed-in users vote on problems and comments.
- Provides contributor and admin workflows for creating, updating, publishing, archiving, and deleting problems.
- Provides administrator tools for listing users, changing roles, verifying emails, and banning users.
- Sends verification OTP emails through Mailjet.

## Tech Stack

- **Framework:** Next.js 16 App Router with React 19 and TypeScript.
- **Styling:** Tailwind CSS 4, shadcn-style components, Radix UI primitives, Lucide icons, and next-themes.
- **Database:** PostgreSQL through Neon serverless, Drizzle ORM, and Drizzle Kit.
- **Authentication:** Better Auth with email/password, email OTP, GitHub, Google, usernames, sessions, and admin access control.
- **Forms and Validation:** React Hook Form and Zod.
- **Rich Content:** `@uiw/react-md-editor`, Markdown rendering, KaTeX, `remark-math`, `rehype-katex`, and sanitized custom callouts.
- **Tables and Lists:** TanStack Table, infinite grids, pagination, filters, and URL-backed query state through nuqs.
- **Email:** Mailjet transactional email for verification codes.

## Application Structure

```txt
src/
  app/                         Next.js App Router routes and layouts
    (public)/                  Public home, about, and problem detail pages
    (auth)/                    Sign-in and sign-up pages
    admin/                     Role-gated dashboard pages
    api/auth/[...all]/         Better Auth route handler
  components/                  Shared UI, app shell, markdown, tables, and async states
  data/data/server.ts          Server-side environment variable schema
  db/                          Drizzle client, schema exports, and table definitions
  features/                    Feature modules for problems, comments, votes, users, keywords
  hooks/                       Shared React hooks
  lib/                         Auth helpers, cache helpers, constants, types, utilities
  services/mailjet/            Mailjet client and OTP email template
public/
  documents/DaoCV.pdf          Public CV document linked from the Hailong Dao page
```

## Public Routes

- `/` - searchable and filterable problem feed.
- `/about` - explanation of the collection, intended audience, ratings, statuses, commenting, and project authorship.
- `/problems/[mathProblemId]` - problem detail page with metadata, content, votes, comments, and a comment form.
- `/math` - personal academic page for Hailong Dao with research, teaching, activities, and personal information.
- `/sign-in` and `/sign-up` - authentication flows with social providers and email verification.

## Admin Routes

- `/admin/create` - create a new problem. Requires `mathProblem:create`.
- `/admin/math-problems` - manage the current user's problems, or all problems for admins.
- `/admin/users` - manage user accounts. Requires user list permissions.

The app defines three user roles:

- `user` - regular authenticated user with no problem management permissions.
- `contributor` - can create, read, update, and delete their own math problems.
- `admin` - can manage all math problems and access Better Auth admin capabilities.

## Data Model

The database schema includes:

- Better Auth tables for users, sessions, accounts, and verifications.
- `math_problems` with title, content, author, publication status, problem status, difficulty, views, timestamps, and keyword relations.
- `keywords` and the join table that connects keywords to problems.
- `comments` attached to problems and optionally to users.
- `math_problem_votes` and `comment_votes`, each using `up` and `down` vote types.

Problem publication status is separate from mathematical status:

- Publication status: `draft`, `published`, `archived`.
- Problem status: `open`, `solved`, `possibly-solved`.
- Difficulty: integer values from 1 to 5.

## Requirements

- Node.js 20.9 or newer.
- pnpm, because the repository includes `pnpm-lock.yaml` and `pnpm-workspace.yaml`.
- A PostgreSQL database URL. The current database client is configured for Neon serverless.
- Mailjet credentials for OTP email delivery.
- GitHub and Google OAuth credentials if social sign-in should work locally.

## Environment Variables

Create a local `.env` file with the following values:

```bash
DATABASE_URL=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

MAILJET_API_KEY=
MAILJET_API_SECRET=
SENDER_EMAIL=
```

Notes:

- `BETTER_AUTH_URL` should match the URL where the app is running.
- `SENDER_EMAIL` must be a sender address accepted by the configured Mailjet account.
- The app validates these variables at runtime through `@t3-oss/env-nextjs`, so missing values will fail fast.

## Getting Started

Install dependencies:

```bash
pnpm install
```

Push the current Drizzle schema to your database:

```bash
pnpm db:push
```

Start the development server:

```bash
pnpm dev
```

Open `http://localhost:3000`.

Next.js 16 uses Turbopack by default for `next dev`. If you need to force Webpack for debugging, run:

```bash
pnpm exec next dev --webpack
```

## Available Scripts

- `pnpm dev` - start the Next.js development server.
- `pnpm build` - create a production build.
- `pnpm start` - run the production server after building.
- `pnpm lint` - run ESLint.
- `pnpm db:push` - push the Drizzle schema to the database.
- `pnpm db:migrate` - run Drizzle migrations.
- `pnpm db:generate` - generate Drizzle migration files.
- `pnpm db:studio` - open Drizzle Studio.
- `pnpm db:auth` - generate Better Auth schema output into `src/db/schemas/new-user.ts`.

## Development Notes

- Route state for problem filters is parsed with `nuqs`, so query params are part of the public browsing experience.
- Server actions live inside feature modules and return small `{ error, message }` style responses.
- Next.js cache tags are used for problems, comments, keywords, and users. Mutating actions should revalidate the relevant feature cache.
- Markdown content is sanitized before rendering and supports math through KaTeX.
- `next.config.ts` enables `cacheComponents`, so data loading and cache invalidation are important parts of the app behavior.
- The project uses the `@/*` TypeScript path alias for files under `src/`.

## Typical Workflow

1. Sign up or sign in.
2. Verify the account email through the Mailjet-delivered OTP flow.
3. Promote the account to `contributor` or `admin` in the database or through admin tooling.
4. Create a problem from `/admin/create`.
5. Publish it from the admin problem table.
6. Browse it publicly from `/`, open the detail page, and test voting or comments.

## Production Checklist

- Configure production environment variables.
- Point `BETTER_AUTH_URL` at the production origin.
- Configure GitHub and Google OAuth callback URLs for the production domain.
- Verify Mailjet sender identity and deliverability.
- Run `pnpm lint`.
- Run `pnpm build`.
- Apply database migrations or push the schema before serving traffic.

## Project Status

DaoMath is currently a private application repository. The codebase already includes the main public browsing experience, authentication, contributor/admin dashboards, database schema, and email verification flow. The next likely improvements are seed data, automated tests, and deployment-specific documentation.

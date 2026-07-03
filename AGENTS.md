<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Anime Project v2

## Stack
- **Next.js 16.2.9** (App Router), **React 19.2.4**, **TypeScript 5**
- **Tailwind CSS v4** + `@tailwindcss/postcss` plugin (PostCSS config at `postcss.config.mjs`)
- **shadcn/ui** (radix-sera style) — components in `components/ui/`, icon library: lucide-react
- **Prisma v7** with `@prisma/adapter-pg` + `@prisma/client` — uses new `prisma.config.ts` (defineConfig) format
- **Database**: Supabase PostgreSQL
- **Auth**: Custom cookie-based (no NextAuth). Cookie: `session_user_id` (httpOnly, 7 day expiry). Server actions at `src/app/actions/auth.ts`, auth helper at `src/lib/auth.ts` (imports `server-only`)
- **External API**: AniList GraphQL (`https://graphql.anilist.co`), client in `lib/anilist.ts` (fetch-based, 5min revalidate)

## Commands
| Command | Action |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint v9 (flat config: `eslint.config.mjs`) |
| `npx tsc --noEmit` | Typecheck (no npm script exists — run manually) |
| `npx prisma generate` | Generate Prisma client |
| `npx prisma migrate dev` | Run migrations in dev |
| `npx prisma studio` | DB browser |

## Project Structure
```
src/app/              # App Router pages + API routes
  (auth)/login/       # Login page
  (auth)/register/    # Register page
  actions/auth.ts     # Server actions (loginUser, registerUser)
  api/interact/       # POST — bookmark/favorite
  api/profile/        # GET — user bookmarks & favorites
  anime/[id]/         # Anime detail page (dynamic route)
  explore/            # Search/explore page
  profile/            # User profile page
  rankings/           # Top rated page
  trending/           # Trending page
src/lib/auth.ts       # getCurrentUser() (server-only)
lib/                  # Shared non-app code
  anilist.ts          # AniList GraphQL queries
  prisma.ts           # PrismaClient singleton (Pg adapter)
  utils.ts            # cn() helper
components/           # Shared React components
  Home/               # Home page components
  ui/                 # shadcn/ui primitives
prisma/
  schema.prisma       # DB schema (User, Anime, Bookmark, Favorite)
  prisma.config.ts    # Prisma config (defineConfig)
```

## Key quirks
- **Path alias**: `@/*` maps to root `./*` (not `src/*`). Import from `lib/` as `@/lib/...`
- **`api/interact/route.ts`** uses real auth via `getCurrentUser()` (401 if not logged in)
- **No test framework** in devDependencies
- **`next.config.ts`** marks `@prisma/client` as `serverExternalPackages`
- **Image remote patterns** configured for: Unsplash, MyAnimeList, TMDB, AniList, YouTube
- **`prisma.config.ts`** loads env via `dotenv/config` import — `.env` is gitignored (`.env*`)

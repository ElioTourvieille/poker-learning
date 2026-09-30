# Poker Lab

Outil personnel de suivi de formation poker (Masterclass Kill Tilt) et de mains jouées. Contexte et conventions : [AGENTS.md](AGENTS.md).

## Structure

- `apps/api` : NestJS (logique métier, appels IA)
- `apps/web` : Next.js, App Router
- `packages/db` : schéma Prisma partagé (`@poker-lab/db`)

## Démarrage

```
cp .env.example .env   # renseigner DATABASE_URL et ANTHROPIC_API_KEY
pnpm install
pnpm db:generate
pnpm dev:api           # http://localhost:3001
pnpm dev:web           # http://localhost:3000
```

Première migration, une fois `DATABASE_URL` renseignée : `pnpm db:migrate --name init`.

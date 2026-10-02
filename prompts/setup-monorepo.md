# Setup monorepo (Phase 0)

## Objectif
Poser le socle du projet : monorepo pnpm avec `apps/api` (NestJS), `apps/web` (Next.js) et `packages/db` (Prisma), sans aucune logique métier. Le repo doit installer, builder et démarrer à vide.

## Fichiers inspectés / skills lus
- `AGENTS.md`, `prompts/Checklist de démarrage.md` (Phase 0), `prompts/Poker Lab — Spec projet Q4.md` (modèle Prisma)
- Skill `origin-studio-workflow`
- Outils vérifiés : Node v22.21.1, pnpm 10.28.1, Nest CLI 10.4.5, git 2.47, gh connecté (ElioTourvieille)

## Hypothèses prises
1. La racine du monorepo est le dossier actuel `poker-learning/` (pas de sous-dossier `poker-lab/`). Le nom de package racine sera `poker-lab`.
2. `git init` sur `main` avec un commit initial (`AGENTS.md` + `/prompts`), puis tout le setup sur une branche `feature/setup-monorepo`.
3. Prisma : dernière version stable, docs vérifiées via Context7 à l'implémentation (la config `prisma.config.ts` / le generator changent selon la version majeure).
4. Le schéma Prisma est copié tel quel de la spec dans `packages/db/schema.prisma`. `packages/db` exporte le client généré pour que `apps/api` l'importe (`@poker-lab/db`).
5. `apps/web` : App Router, TypeScript, Tailwind, ESLint, sans dossier `src/`, alias `@/*` par défaut.
6. `apps/api` : `nest new` avec pnpm, `--skip-git`. Aucun module métier créé.
7. `.env` à la racine (gitignoré), `.env.example` versionné avec `DATABASE_URL` et `ANTHROPIC_API_KEY` vides.
8. `.claude/agents/` (sous-agents Origin Studio) est absent du repo. Je ne l'invente pas : à récupérer depuis le template Git Origin Studio.
9. `prisma migrate dev --name init` n'est PAS exécuté tant que `DATABASE_URL` n'est pas fournie par l'utilisateur. **Mise à jour** : l'URL Neon a été fournie, la migration `init` a été appliquée, puis `add_user_id_scoping` (décision A de l'utilisateur après revue : `userId` ajouté à `ReviewLog` et `HandConceptLink`, pour respecter le scoping systématique d'AGENTS.md ; écart assumé par rapport à la spec). Les migrations passent par `DIRECT_URL` (URL Neon sans pooler).
10. La création du dépôt GitHub est une action externe : faite uniquement sur confirmation explicite (nom + visibilité).

## Fichiers à créer/modifier
- Racine : `pnpm-workspace.yaml`, `package.json`, `.gitignore`, `.env.example`, `.nvmrc` (22), `README.md` minimal
- `apps/api/` : scaffold `nest new`
- `apps/web/` : scaffold `create-next-app`
- `packages/db/` : `package.json`, `schema.prisma`, `prisma.config.ts` (si requis par la version), `src/index.ts` (export du client)
- Scripts racine : `dev:api`, `dev:web`, `build`, `lint`, `db:generate`, `db:migrate`
- `AGENTS.md` et `prompts/` existent déjà : rien à modifier

## Critères d'acceptation
- [ ] `pnpm install` à la racine réussit sans erreur
- [ ] `pnpm --filter api build` et `pnpm --filter web build` réussissent
- [ ] `pnpm db:generate` génère le client Prisma à partir du schéma de la spec
- [ ] `apps/api` importe `@poker-lab/db` (type `PrismaClient`) et compile
- [ ] `pnpm dev:api` répond sur `GET /` ; `pnpm dev:web` affiche la page par défaut
- [ ] Aucun secret versionné ; `.env` ignoré par git ; aucune clé lisible côté `apps/web`
- [ ] Repo git initialisé, branche `feature/setup-monorepo`, commits propres

## Comment tester
```
pnpm install
pnpm build   # ordre topologique : @poker-lab/db avant api et web (dist/ et generated/ sont gitignorés)
pnpm dev:api   # http://localhost:3001 (port différent du web)
pnpm dev:web   # http://localhost:3000
```

## Hors scope (à faire par l'utilisateur)
Compte Supabase/Neon + `DATABASE_URL`, clé Anthropic, bucket Storage, confirmation de création du repo GitHub, plugin/sous-agents Origin Studio.

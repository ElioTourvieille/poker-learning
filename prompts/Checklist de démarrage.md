# Checklist de démarrage

Coche au fur et à mesure. Chaque phase reprend les jalons de la Roadmap Q4 (onglet principal).

## Phase 0 — Mise en place (avant de coder)

- [ ] Créer le dossier `poker-lab/` en monorepo pnpm : `apps/api` (NestJS), `apps/web` (Next.js), `packages/db` (schéma Prisma partagé)
- [ ] Initialiser `pnpm-workspace.yaml` et le `package.json` racine
- [ ] Créer un dépôt GitHub et connecter le repo local
- [ ] Créer `AGENTS.md` à la racine (contexte du projet, conventions Origin Studio, lien vers ce doc)
- [ ] Créer un compte Supabase (ou Neon) et un projet Postgres gratuit
- [ ] Récupérer la chaîne de connexion (`DATABASE_URL`)
- [ ] Installer Node.js LTS (vérifier avec `node -v`)
- [ ] Installer pnpm : `npm i -g pnpm`
- [ ] Installer le Nest CLI : `pnpm add -g @nestjs/cli`
- [ ] Scaffold le backend dans `apps/api` : `nest new api` (depuis `apps/`, gestionnaire pnpm)
- [ ] Scaffold le frontend dans `apps/web` : `pnpm create next-app@latest web` (App Router, TypeScript, Tailwind)
- [ ] Dans `packages/db`, installer Prisma : `pnpm add prisma @prisma/client` puis `pnpm prisma init`
- [ ] Coller le schéma Prisma (onglet principal, section Modèle de données) dans `packages/db/schema.prisma`
- [ ] Renseigner `DATABASE_URL` dans `.env` (chargé par `apps/api`)
- [ ] Lancer la première migration : `pnpm prisma migrate dev --name init`
- [ ] Vérifier que le plugin Origin Studio est actif sur ce repo dans Claude Code (liste des skills disponibles) ; sinon l'installer depuis le marketplace interne
- [ ] Créer le dossier `/prompts` à la racine (convention `origin-studio-workflow`)
- [ ] Créer une clé API Anthropic (ou OpenAI) et l'ajouter à `.env` côté `apps/api` uniquement (`ANTHROPIC_API_KEY`), jamais côté frontend
- [ ] Créer un bucket Supabase Storage (ou Cloudflare R2) pour les screenshots de ranges

## Phase 1 — Socle (6–19 oct)

- [ ] Écrire `/prompts/concepts.md` : quoi, pourquoi, champs attendus
- [ ] Lancer la skill `nestjs-feature-module` pour scaffolder le module `concepts`
- [ ] Répéter pour le module `notes`
- [ ] Répéter pour le module `flashcards` (inclure `easeFactor`, `interval`, `dueAt`)
- [ ] Revue de chaque module avec `origin-nestjs-reviewer` puis `origin-pr-reviewer` avant de merger
- [ ] Construire 3 pages Next.js minimales : ajouter une note, écrire une fiche, liste des fiches dues
- [ ] Test réel : regarder un module de la Masterclass et écrire 3 notes + 3 fiches directement dans l'outil
- [ ] **Jalon** : le cycle note → fiche → tenue dans l'outil sans bug bloquant

## Phase 2 — SRS + IA (20 oct – 2 nov)

- [ ] Scaffold le module `review` (reçoit une réponse libre, renvoie verdict + qualité 0-5)
- [ ] Écrire le prompt système d'évaluation (comparer à la fiche d'origine, noter, expliquer l'écart)
- [ ] Implémenter SM-2 (ease factor, intervalle) côté service, avec tests
- [ ] Brancher l'appel à l'API Anthropic depuis le backend uniquement
- [ ] Page Next.js "révision du jour" : carte due, réponse libre, feedback IA affiché
- [ ] **Jalon** : une carte notée par l'IA en conditions réelles, pas un mock

## Phase 3 — Mains & ranges (3–23 nov)

- [ ] Scaffold le module `hands` (CRUD + `HandConceptLink`)
- [ ] Scaffold le module `ranges` (upload image → stockage → appel vision → `rangeText`)
- [ ] Page Next.js "ajouter une main", testée depuis le téléphone
- [ ] Page Next.js "lier un concept à une main" (recherche full-text)
- [ ] Vérifier à l'œil la transcription d'un premier vrai screenshot de range
- [ ] **Jalon** : une main réelle liée à un concept, une range réelle transcrite correctement

## Phase 4 — Revue & polish (24 nov – 14 déc)

- [ ] Endpoint + page "revue hebdo" (dette SRS, mains sans concept, prochain module)
- [ ] Déployer le backend (Railway ou Fly.io) et le frontend (Vercel)
- [ ] Passer `origin-security-reviewer` en deep scan avant mise en prod (endpoint upload + appel IA)
- [ ] Générer un jeu de données de test avec `origin-seed-generator` avant de committer tes vraies données
- [ ] **Jalon** : routine hebdo tenue 2 semaines de suite, sans intervention manuelle en base

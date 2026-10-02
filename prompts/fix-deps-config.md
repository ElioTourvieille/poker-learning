# Correctifs dépendances et config (suite du setup)

## Objectif
Traiter les points reportés des revues de la PR #1 : vulnérabilités de dépendances de `apps/api` (Nest 10.x, `multer`), échec explicite de `prisma migrate` sans URL, chargement du `.env` côté API. Aucune logique métier.

## Fichiers inspectés / skills lus
- Revues `origin-security-reviewer` et `origin-pr-reviewer` de la PR #1 (constats moyens et mineurs)
- `apps/api/package.json` (Nest `^10.0.0`, `@nestjs/cli ^10`, `@nestjs/testing ^10`, jest 29, eslint 8)
- `packages/db/prisma.config.ts`, `.env.example`, `prompts/setup-monorepo.md`

## Hypothèses prises
1. Montée de `@nestjs/common`, `@nestjs/core`, `@nestjs/platform-express`, `@nestjs/testing`, `@nestjs/cli` et `@nestjs/schematics` vers la dernière 11.x stable (Express 5, Node 20+ requis, Node 22 en place). Vérifier le guide de migration Nest 10 → 11 via Context7 avant de modifier.
2. Si la montée casse le scaffold, repli sur `pnpm.overrides` (racine) pour `multer`, `qs`, `body-parser`, `file-type` aux versions corrigées, et report de la 11.x.
3. `pnpm audit` : objectif zéro vulnérabilité `high` en dépendances de production d'`apps/api`. Les vulnérabilités dev-only (outillage) sont listées mais non bloquantes.
4. `prisma.config.ts` : si `DIRECT_URL` et `DATABASE_URL` sont absentes, `prisma migrate` échoue avec un message français explicite ; `prisma generate` reste utilisable sans URL (le repli est conservé pour `generate` uniquement, via détection de la commande).
5. Chargement du `.env` côté API : `@nestjs/config` avec `envFilePath` pointant vers le `.env` de la racine, sans valider de variable métier à ce stade (la validation viendra avec le premier module qui les lit).
6. Hors scope : `ValidationPipe`, CORS, helmet (à ajouter avec le premier endpoint), tout module métier.
7. **Ajouté après validation** : l'avertissement TypeScript « moduleResolution=node10 is deprecated » vient de `packages/db/tsconfig.json`. Correction par `module`/`moduleResolution: node16` plutôt que `ignoreDeprecations`, qui ne ferait que masquer l'erreur avant TypeScript 7.
8. **Résultat de la montée** : Nest 11.2.7 sans casse du scaffold, donc pas de repli sur les overrides pour Nest. Il reste des vulnérabilités en prod dans les dépendances internes du CLI Prisma (`mysql2`, `deepmerge-ts`) : corrigées par `overrides` dans `pnpm-workspace.yaml` (mysql2 inutilisé, base Postgres).

## Fichiers à créer/modifier
- `apps/api/package.json`, `pnpm-lock.yaml` (montée Nest, ajout `@nestjs/config`)
- `apps/api/src/app.module.ts` (import de `ConfigModule`)
- `packages/db/prisma.config.ts` (échec explicite pour `migrate`)
- `package.json` racine : `pnpm.overrides` uniquement si hypothèse 2 appliquée
- `prompts/fix-deps-config.md` (ce fichier)

## Critères d'acceptation
- [ ] `pnpm install --frozen-lockfile && pnpm build` passe sur un clone propre
- [ ] `pnpm audit --prod` : aucune vulnérabilité `high` ou `critical` pour `apps/api`
- [ ] `GET /` de l'API répond toujours « Hello World! » sur le port 3001
- [ ] `pnpm --filter api test` passe (test généré par `nest new`)
- [ ] `prisma migrate status` sans `DIRECT_URL` ni `DATABASE_URL` échoue avec un message clair ; `pnpm db:generate` marche sans URL
- [ ] `process.env.DATABASE_URL` est lisible côté API depuis le `.env` de la racine (vérifié sans afficher sa valeur)
- [ ] Aucun secret versionné

## Comment tester
```
pnpm install --frozen-lockfile
pnpm build
pnpm audit --prod
pnpm --filter api test
pnpm dev:api   # GET http://localhost:3001
```

## Hors scope
Modules `concepts`, `notes`, `flashcards` (phase 1), création du bucket Supabase, clé Anthropic.

# AGENTS.md

## Projet
Poker Lab — outil personnel de suivi de formation poker (Masterclass Kill Tilt) et de mains jouées.
Spec complète : `/prompts/Poker Lab — Spec projet Q4` + `/prompts\Checklist de démarrage.md`

## Stack
- Monorepo pnpm : apps/api (NestJS + Prisma), apps/web (Next.js App Router), packages/db (schéma Prisma partagé)
- PostgreSQL (Supabase/Neon), recherche full-text native
- IA : API Anthropic, appels uniquement depuis apps/api, jamais côté client

## Conventions (Origin Studio)
- Scoping userId systématique sur chaque table, même en solo
- DTO validés avec class-validator, messages d'erreur en français
- Tests de service sans TestingModule
- Une branche par module, prompt d'implémentation dans /prompts/[feature].md avant de coder
- Revue avant merge : origin-nestjs-reviewer, origin-pr-reviewer, origin-security-reviewer sur tout endpoint combinant upload + appel IA

## Ce que l'IA ne fait jamais
- Ne génère pas une fiche Q/R à la place de l'utilisateur
- Ne crée pas de lien main → concept automatiquement
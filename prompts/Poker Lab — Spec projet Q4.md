# Poker Lab — Spec projet Q4

Sep 28, 2026 · @Elio

## Vue d'ensemble

L'outil combine trois briques volontairement contraignantes plutôt qu'une archive passive, plus un module de capture des ranges :

- **Notes structurées** pendant le visionnage (concept / situation / règle de décision)
- **Fiches Q/R écrites à la main**, testées par l'IA en répétition espacée — réponse libre, jamais de QCM
- **Journal de mains** (live et online) que tu relies toi-même aux concepts vus
- **Ranges par capture d'écran**, converties par l'IA en notation texte (AT+, AJs+, 22+...)

Le principe commun : c'est toi qui formules — la note, la fiche, le lien main-concept — l'IA vérifie et interroge, elle ne mâche jamais le travail à ta place.

Objectif secondaire assumé : ce projet sert aussi de terrain d'entraînement pour ton propre workflow Origin Studio (scaffold NestJS, revue de code, process de branches/PR) sur un enjeu personnel à faible risque.

## Les 4 modules

| Module | Ce que tu fais | Rôle pédagogique | Ce que fait l'IA |
| --- | --- | --- | --- |
| Notes de formation | Pendant chaque session hebdo, tu notes en 2-3 lignes par situation : concept, contexte, décision | Force la formulation active pendant le visionnage, sans attendre la fin | Indexe les notes, les relie par mot-clé aux fiches et aux mains existantes |
| Fiches Q/R (SRS) | En fin de module, tu écris toi-même 5-10 questions et leurs réponses depuis tes notes | Écrire la question t'oblige déjà à isoler ce qui compte ; la répétition espacée ancre le reste | Programme les révisions (SM-2), évalue ta réponse libre et signale les écarts avec ta fiche d'origine |
| Journal de mains | Tu ajoutes tes mains marquantes (live/online), et tu écris toi-même le lien avec un concept si tu en vois un | Le lien intellectuel main-concept doit rester le tien pour s'ancrer | Retrouve par mot-clé tes notes et fiches pertinentes pendant que tu écris la main, sans faire le lien à ta place |
| Ranges par capture | Tu screenshotes la range affichée dans la Masterclass | T'évite de retaper des grilles à la main tout en gardant une trace exploitable | Transcrit l'image en notation texte (AT+, AJs+, 22+) et la rattache au concept ou à la fiche en cours |

## Modèle de données (Prisma)

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  createdAt DateTime @default(now())

  concepts   Concept[]
  notes      Note[]
  flashcards Flashcard[]
  hands      Hand[]
  ranges     RangeCapture[]
}

model Concept {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  title     String
  module    String?
  summary   String?
  createdAt DateTime @default(now())

  notes      Note[]
  flashcards Flashcard[]
  handLinks  HandConceptLink[]
  ranges     RangeCapture[]

  @@index([userId])
}

model Note {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  conceptId String?
  concept   Concept? @relation(fields: [conceptId], references: [id])
  content   String
  moduleRef String?
  createdAt DateTime @default(now())

  @@index([userId])
  @@index([conceptId])
}

model Flashcard {
  id         String   @id @default(cuid())
  userId     String
  user       User     @relation(fields: [userId], references: [id])
  conceptId  String?
  concept    Concept? @relation(fields: [conceptId], references: [id])
  question   String
  answer     String
  easeFactor Float    @default(2.5)
  interval   Int      @default(0)
  reps       Int      @default(0)
  dueAt      DateTime @default(now())
  createdAt  DateTime @default(now())

  reviews ReviewLog[]

  @@index([userId, dueAt])
}

model ReviewLog {
  id          String    @id @default(cuid())
  flashcardId String
  flashcard   Flashcard @relation(fields: [flashcardId], references: [id])
  quality     Int
  userAnswer  String?
  aiFeedback  String?
  reviewedAt  DateTime  @default(now())
}

enum HandFormat {
  LIVE
  ONLINE
}

model Hand {
  id        String     @id @default(cuid())
  userId    String
  user      User       @relation(fields: [userId], references: [id])
  format    HandFormat
  playedAt  DateTime
  stakes    String?
  position  String?
  summary   String
  result    String?
  createdAt DateTime   @default(now())

  conceptLinks HandConceptLink[]

  @@index([userId, playedAt])
}

model HandConceptLink {
  id        String  @id @default(cuid())
  handId    String
  hand      Hand    @relation(fields: [handId], references: [id])
  conceptId String
  concept   Concept @relation(fields: [conceptId], references: [id])
  note      String?

  @@unique([handId, conceptId])
}

model RangeCapture {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  conceptId String?
  concept   Concept? @relation(fields: [conceptId], references: [id])
  imagePath String
  rangeText String?
  situation String?
  createdAt DateTime @default(now())

  @@index([userId])
}
```

Le `userId` sur chaque table suit ta convention Origin Studio (scoping systématique) même si tu es seul utilisateur aujourd'hui — ça te laisse la porte ouverte pour partager l'outil plus tard sans tout refactorer. Avec Postgres, la recherche plein texte se fait via `to_tsvector`/`to_tsquery` (ou l'extension `pg_trgm`) sur `Note.content`, `Flashcard.question/answer` et `Hand.summary`, plutôt que le FTS5 de SQLite.

## Workflow d'utilisation

Deux routines tournent en parallèle et se retrouvent dans la revue hebdo.

**Routine formation — 1 soir/semaine, \~2h**

| Étape | Durée | Ce que tu produis |
| --- | --- | --- |
| Visionnage d'un module | 45 min | Notes structurées + captures de ranges |
| Distillation en fiches | 30 min | 5-10 fiches Q/R écrites par toi |
| Application sur situations réelles | 30 min | Notes reliées à 2-3 mains si pertinent |
| Planification de la semaine | 15 min | Prochain module + créneau de révision |

**Routine mains — en continu**

| Étape | Quand | Ce que tu produis |
| --- | --- | --- |
| Ajout d'une main marquante | Après une session live/online | Entrée dans le journal (contexte, action, résultat) |
| Lien avec un concept | Si tu identifies un rapprochement | Lien manuel main → concept, jamais automatique |

**Révision quotidienne — 5-10 min**

Cartes dues du jour, réponse libre à voix haute ou à l'écrit, l'IA compare à la fiche d'origine et ajuste l'intervalle (SM-2).

**Revue hebdo — 15-20 min**

Dette de cartes en retard, mains ajoutées dans la semaine, mains encore sans concept lié, module suivant à planifier.

## Intégration IA

Trois usages distincts, bornés délibérément — l'IA transcrit, évalue et retrouve, elle ne génère jamais une fiche ou un lien main-concept à ta place.

| Usage | Déclencheur | Entrée | Sortie |
| --- | --- | --- | --- |
| OCR des ranges | Tu uploades un screenshot | Image PNG/JPG | Notation texte (AT+, AJs+, 22+) rattachée à un concept |
| Évaluation SRS | Une carte arrive à échéance | Ta réponse libre + la fiche d'origine | Verdict, explication de l'écart, note de qualité 0-5 pour SM-2 |
| Recherche mains-concepts | Tu tapes une main ou une question | Requête + notes/fiches indexées | Liste de notes/fiches pertinentes avec leur source |

Un seul point d'API à gérer : une clé (Anthropic ou OpenAI) en variable d'environnement côté NestJS, jamais exposée au client ni stockée en base. Pour la recherche, la recherche plein texte Postgres fait le premier tri ; l'appel IA n'intervient que pour reformuler ou résumer si le résultat brut ne suffit pas.

## Stack technique et architecture

L'accès mobile compte : tu ajouteras des mains juste après une session live, donc pas de base locale mono-poste — il faut une base hébergée accessible depuis le téléphone.

| Couche | Techno | Rôle |
| --- | --- | --- |
| Backend API | NestJS + Prisma | Modules concepts, notes, flashcards, hands, ranges, review — logique métier + appels IA |
| Frontend | Next.js (App Router) | Saisie rapide (note, fiche, main), file de révision quotidienne, revue hebdo |
| Base de données | PostgreSQL (Supabase ou Neon, tier gratuit) | Schéma décrit plus haut, recherche plein texte native |
| Stockage fichiers | Supabase Storage ou Cloudflare R2 | Screenshots de ranges |
| IA | API Anthropic (ou OpenAI) | Vision (ranges), évaluation SRS, recherche |
| Hébergement | Vercel (front) + Railway ou Fly.io (Nest) | Déploiement continu depuis Git |

Auth minimale : un seul compte personnel, pas besoin d'un vrai système multi-utilisateur pour démarrer — un simple email/mot de passe ou magic link suffit, avec `userId` déjà présent partout dans le schéma si tu veux ouvrir l'outil plus tard.

## Utilisation du plugin Origin Studio

Ce projet solo est un bon terrain pour appliquer ton propre process d'agence sans la pression d'un client.

- **Scaffold de chaque module** (concepts, notes, flashcards, hands, ranges, review) via la skill `nestjs-feature-module` : controller, service, DTO et test de service générés avec le scoping `userId`, les messages d'erreur en français et class-validator, comme sur tes projets clients.
- **Process de branches/PR** via `origin-studio-workflow` : une branche par module, un prompt d'implémentation dans `/prompts/[feature].md` avant de coder, même seul — ça t'oblige à clarifier la fonctionnalité avant de l'écrire.
- **Revue avant merge** : `origin-pr-reviewer` sur chaque module, `origin-nestjs-reviewer` sur les conventions Prisma/NestJS, `origin-security-reviewer` en particulier sur l'endpoint d'upload de screenshot combiné à un appel IA — exactement le type de surface qu'il cible.
- **Jeu de données de test** via `origin-seed-generator` avant ta première vraie session : génère des concepts, fiches et mains fictifs pour tester la révision espacée et la revue hebdo sans attendre d'avoir de vraies données.

Pas besoin de suivre tout le process à la lettre vu que c'est un projet perso, mais le faire une fois de bout en bout sur un enjeu faible est un bon entraînement avant de l'appliquer plus strictement chez Origin Studio.

## Roadmap Q4

&#91;embedded content: roadmap · 4 phases, 3 jalons\]

- [ ] Chaque phase se termine par un cycle réellement utilisé (pas juste codé) avant de passer à la suivante — c'est le jalon qui compte, pas la date.

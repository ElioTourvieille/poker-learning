import { resolve } from "node:path";
import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// .env unique à la racine du monorepo, quel que soit le dossier courant
config({ path: resolve(__dirname, "../../.env"), quiet: true });

// CLI (migrate) : URL directe Neon (sans pooler) si fournie, sinon DATABASE_URL.
// `||` et non `??` : une variable laissée vide dans le .env doit retomber sur l'autre.
const url = process.env.DIRECT_URL || process.env.DATABASE_URL;

// `prisma generate` n'a pas besoin de base ; les commandes qui s'y connectent exigent une URL.
// Détection par argv : couvre `migrate` et `db`, pas `studio` (limite assumée, la CLI évalue cette config dans son process).
if (!url && process.argv.some((arg) => arg === "migrate" || arg === "db")) {
  throw new Error(
    "DIRECT_URL ou DATABASE_URL est manquante : renseignez-la dans le .env à la racine du projet.",
  );
}

export default defineConfig({
  schema: "schema.prisma",
  migrations: { path: "migrations" },
  datasource: { url: url ?? "postgresql://user:password@localhost:5432/unset" },
});

import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// .env unique à la racine du monorepo
config({ path: "../../.env", quiet: true });

export default defineConfig({
  schema: "schema.prisma",
  migrations: { path: "migrations" },
  // CLI (migrate) : URL directe Neon (sans pooler) si fournie, sinon DATABASE_URL.
  // `prisma generate` n'a pas besoin de base ; `migrate` échoue tant qu'aucune URL n'est renseignée.
  datasource: {
    url:
      process.env.DIRECT_URL ??
      process.env.DATABASE_URL ??
      "postgresql://user:password@localhost:5432/unset",
  },
});

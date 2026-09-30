import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// .env unique à la racine du monorepo
config({ path: "../../.env", quiet: true });

export default defineConfig({
  schema: "schema.prisma",
  migrations: { path: "migrations" },
  // `prisma generate` n'a pas besoin de base ; `migrate` échoue tant que DATABASE_URL n'est pas renseignée
  datasource: { url: process.env.DATABASE_URL ?? "postgresql://user:password@localhost:5432/unset" },
});

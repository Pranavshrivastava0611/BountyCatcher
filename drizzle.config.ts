import { defineConfig } from "drizzle-kit";

export default defineConfig({
    dialect: "postgresql",
    schema: "./lib/schema.ts",
    dbCredentials: {
      url: process.env.NEXT_PUBLIC_DATABASE_CONNECTION_STRING!,
    },
  });
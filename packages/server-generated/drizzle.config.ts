import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { config } from "dotenv"
import { defineConfig } from "drizzle-kit"

config({
    path: resolve(dirname(fileURLToPath(import.meta.url)), "../../.env")
})

const url = process.env.SHARED_GENERATED_STORAGE_DATABASE_URL?.trim()

if (!url)
    throw new Error(
        "'SHARED_GENERATED_STORAGE_DATABASE_URL' environment variable is missing."
    )

export default defineConfig({
    schema: "./src/**/schema.ts",
    dialect: "postgresql",

    dbCredentials: { url },
    casing: "snake_case"
})

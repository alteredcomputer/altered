import { drizzle } from "drizzle-orm/node-postgres"
import { schema } from "./schema"

function createDatabase() {
    const url = process.env.GENERATED_DATABASE_URL?.trim()

    if (!url)
        throw new Error(
            "'GENERATED_DATABASE_URL' environment variable is missing."
        )

    return drizzle({
        connection: { connectionString: url },
        schema,
        casing: "snake_case"
    })
}

type Database = ReturnType<typeof createDatabase>

let database: Database | undefined

function getDatabase(): Database {
    database ??= createDatabase()

    return database
}

export { getDatabase }

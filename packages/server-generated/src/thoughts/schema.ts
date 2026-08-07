import { pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { nanoid } from "nanoid"

/**
 * @remarks Raw captured thoughts for the generated-tier cockpit and memory ingest.
 * Drafts only (no alias) - migrate upward into the experimental Thought model later.
 */
const rawThoughts = pgTable("raw_thoughts", {
    id: text()
        .primaryKey()
        .notNull()
        .$defaultFn(() => nanoid()),

    content: text().notNull(),

    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true })
        .notNull()
        .defaultNow()
        .$onUpdateFn(() => new Date())
})

type RawThought = typeof rawThoughts.$inferSelect

export { type RawThought, rawThoughts }

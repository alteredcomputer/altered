import { index, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { nanoid } from "nanoid"
import { ATTRIBUTE_REFERENCE_TYPES } from "../../attributes/storage/schema"
import { thoughts } from "../../thoughts/storage/schema"

/**
 * @remarks `continuous` parts that share a `groupId` are one logical span split
 * only by a source boundary - never render them as separate backlinks.
 */
const BACKLINK_KINDS = ["single", "continuous"] as const

type BacklinkKind = (typeof BACKLINK_KINDS)[number]
type BacklinkSourceType = (typeof ATTRIBUTE_REFERENCE_TYPES)[number]

/**
 * System-level source spans for derived thoughts.
 *
 * @remarks Lives as its own table (not attributes) so overlap / by-source
 * lookups can use indexes. One logical backlink is one `groupId`; each part is
 * a row (`partIndex` orders continuous fragments).
 *
 * @todo P1: Cascade-delete these rows when the thought loses the reserved `derived` dataset membership.
 */
const backlinks = pgTable(
    "backlinks",
    {
        id: text().primaryKey().notNull().$defaultFn(nanoid),

        thoughtId: text()
            .notNull()
            .references(() => thoughts.id, { onDelete: "cascade" }),

        /**
         * Shared by every part of one logical backlink.
         */
        groupId: text().notNull(),

        kind: text({ enum: BACKLINK_KINDS }).$type<BacklinkKind>().notNull(),

        partIndex: integer().notNull().default(0),

        sourceType: text({ enum: ATTRIBUTE_REFERENCE_TYPES })
            .$type<BacklinkSourceType>()
            .notNull(),

        sourceId: text().notNull(),

        start: integer().notNull(),
        end: integer().notNull(),

        createdAt: timestamp({ withTimezone: true }).notNull().defaultNow()
    },
    table => [
        index().on(table.thoughtId),
        index().on(table.groupId),
        index().on(table.sourceType, table.sourceId),
        index().on(table.sourceType, table.sourceId, table.start, table.end)
    ]
)

type BacklinkRow = typeof backlinks.$inferSelect

export {
    BACKLINK_KINDS,
    type BacklinkKind,
    type BacklinkRow,
    type BacklinkSourceType,
    backlinks
}

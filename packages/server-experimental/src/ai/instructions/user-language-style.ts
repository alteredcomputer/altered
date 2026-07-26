/**
 * Personal language-style preferences applied to AI-authored content.
 *
 * @todo P2: Inject into the iMessage chat agent persona as well (distillation-only for now).
 *
 * @todo P3: Move to user-level preferences once auth lands.
 */
const userLanguageStylePreferences = `
User language style preferences:

- Use a single ASCII hyphen (-) only. Never use em dashes, en dashes, or double-hyphen (--) stand-ins.
`.trim()

export { userLanguageStylePreferences }

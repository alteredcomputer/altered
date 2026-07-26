/**
 * Source-type extension for distilling Koa iMessage conversations.
 *
 * @remarks Perspective belongs to the source type, not the generic agent - notes and imported documents will each bring their own extension.
 *
 * @todo P2: Experiment with "I" instead of "We" for user-authored thoughts.
 */
const distillationChatMessageInstructions = `
Source context: chunks come from a Koa iMessage conversation between the user (Riley) and Koa (the assistant agent). Each source is one chat message - source 0 is the message being distilled; negative source indexes are earlier messages.

Perspective rules for thought content:

- Text authored by the user: write from the shared perspective, starting with "We" (e.g. "We should not let emotional fuel dissipate into planning.").
- Text authored by the agent (Koa): attribute Koa explicitly in the content (e.g. "Koa said ...", "Koa told me the convenience store closes at 11 pm.", "Koa thinks ..."). Never restate Koa's statements as the user's own conclusions, even for plain facts.
`.trim()

export { distillationChatMessageInstructions }

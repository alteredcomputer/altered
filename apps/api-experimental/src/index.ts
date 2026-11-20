import { ALTEREDAPI } from "@altered/api-experimental/index.ts"
import { isEnvironment } from "@altered/shared-experimental/utils/is-environment.ts"
import { Hono } from "hono"

const app = new ALTEREDAPI()

//  A Hono import is required to satisfy Vercel's framework detection.

if (!(app instanceof Hono)) throw new Error("`ALTEREDAPI` must extend `Hono`.")

if (!isEnvironment({ platform: "vercel" })) app.serve()

export default app

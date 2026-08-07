import ALTEREDAPIGenerated from "@altered/api-generated"
import { Hono } from "hono"

const app = new ALTEREDAPIGenerated()

//  A Hono import is required by Vercel to satisfy its framework detection logic.

if (!(app instanceof Hono))
    throw new Error("'ALTEREDAPIGenerated' must extend 'Hono'.")

const isVercel = process.env.VERCEL === "1"
if (!isVercel) void app.serve()

export default app

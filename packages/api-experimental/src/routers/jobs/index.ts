import { Hono } from "hono"
import { distillMessageJobRouter } from "./distill-message"

const app = new Hono()

app.route("/distill-message", distillMessageJobRouter)

export { app as jobsRouter }

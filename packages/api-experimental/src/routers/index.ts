import { name, version } from "@altered/core-experimental/config/app"
import { Hono } from "hono"
import { jobsRouter } from "./jobs"
import { webhooksRouter } from "./webhooks"

const app = new Hono()

app.get("/", context =>
    context.json({
        name: `${name} API`,
        version,
        status: "ok"
    })
)

app.route("/webhooks", webhooksRouter)
app.route("/jobs", jobsRouter)

export { app as router }

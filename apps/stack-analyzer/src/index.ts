import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { showRoutes } from "hono/dev"
import { logger } from "hono/logger"
import { z } from "zod"
import { analyzeRepositoryStack } from "./analyzer"
import { env } from "./env"

const { NODE_ENV, PORT, API_KEY } = env()

const app = new Hono()
const api = new Hono()

app.use("/*", logger())
app.get("/", c => c.text("OpenAlternative Stack Analyzer API"))

// Auth middleware
api.use("*", async (c, next) => {
  const apiKey = c.req.header("X-API-Key")

  if (!apiKey || apiKey !== API_KEY) {
    return c.json({ error: "Unauthorized" }, 401)
  }

  await next()
})

api.post("/analyze", zValidator("json", z.object({ repository: z.string() })), async c => {
  const { repository } = c.req.valid("json")

  const result = await analyzeRepositoryStack(repository)

  return c.json(result)
})

app.route("/api", api)

if (NODE_ENV === "development") {
  showRoutes(app, { verbose: true, colorize: true })
}

const server = { port: PORT, fetch: app.fetch }

export default server

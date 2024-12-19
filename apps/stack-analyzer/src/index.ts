import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { z } from "zod"
import { processRepository } from "./analyzer"
import { getTechStack } from "./utils"

const app = new Hono()
const api = new Hono()

app.get("/", c => c.text("OpenAlternative Stack Analyzer API"))

// Auth middleware
api.use("*", async (c, next) => {
  const apiKey = c.req.header("X-API-Key")

  if (!apiKey || apiKey !== process.env.API_KEY) {
    return c.json({ error: "Unauthorized" }, 401)
  }

  await next()
})

api.post("/analyze", zValidator("json", z.object({ repository: z.string() })), async c => {
  const { repository } = c.req.valid("json")

  const result = await processRepository(repository)
  const stack = await getTechStack(result)

  return c.json(stack)
})

app.route("/api", api)

export default {
  port: 3001,
  fetch: app.fetch,
}

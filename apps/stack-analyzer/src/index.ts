import { zValidator } from "@hono/zod-validator"
import { prisma } from "@openalternative/db"
import { ToolStatus } from "@openalternative/db/client"
import type { AnalyserJson } from "@specfy/stack-analyser"
import { Hono } from "hono"
import { z } from "zod"
import { processRepository } from "./analyzer"

const app = new Hono()

const getTechStack = async (json: AnalyserJson) => {
  const techs = json.childs.flatMap(tech => tech.techs)
  return [...new Set(techs)]
}

// Auth middleware
app.use("*", async (c, next) => {
  const apiKey = c.req.header("X-API-Key")

  if (!apiKey || apiKey !== process.env.AUTH_API_KEY) {
    return c.json({ error: "Unauthorized" }, 401)
  }

  await next()
})

app.post(
  "/",

  zValidator(
    "json",
    z.object({
      slug: z.string().optional(),
      take: z.number().optional(),
    }),
  ),

  async c => {
    const { slug, take } = c.req.valid("json")

    const tools = await prisma.tool.findMany({
      where: { status: { in: [ToolStatus.Published, ToolStatus.Scheduled] }, slug },
      select: { id: true, repository: true },
      take,
    })

    try {
      for (const [index, tool] of tools.entries()) {
        console.log(`Processing tool ${index + 1} of ${tools.length}`)

        const result = await processRepository(tool.repository)
        const stack = await getTechStack(result)

        await prisma.tool.update({
          where: { id: tool.id },
          data: { stacks: { set: stack.map(slug => ({ slug })) } },
        })
      }
    } catch (error) {
      console.error("Error processing tools:", error)
      return c.json({ error: "Failed to process tools" }, 500)
    }

    return c.json({ success: true })
  },
)

app.post("/:repository", async c => {
  const repository = c.req.param("repository")

  const result = await processRepository(repository)
  const stack = await getTechStack(result)

  return c.json({ stack })
})

export default app

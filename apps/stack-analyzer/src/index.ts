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
      batchSize: z.number().optional().default(5),
    }),
  ),

  async c => {
    const { slug, take, batchSize } = c.req.valid("json")

    const tools = await prisma.tool.findMany({
      where: { status: { in: [ToolStatus.Published, ToolStatus.Scheduled] }, slug },
      select: { id: true, repository: true },
      take,
    })

    try {
      for (let i = 0; i < tools.length; i += batchSize) {
        const batch = tools.slice(i, i + batchSize)

        const promises = batch.map(async (tool, index) => {
          console.log(`Processing batch ${Math.floor(i / batchSize) + 1}, tool ${index + 1}`)

          const result = await processRepository(tool.repository)
          const stack = await getTechStack(result)

          await prisma.tool.update({
            where: { id: tool.id },
            data: { stacks: { set: stack.map(slug => ({ slug })) } },
          })
        })

        await Promise.all(promises)
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

import { prisma } from "@openalternative/db"
import { type Tool, ToolStatus } from "@openalternative/db/client"
import { Hono } from "hono"
import { processRepository } from "./analyzer"

const app = new Hono()

const processTool = async (tool: Pick<Tool, "id" | "repository">) => {
  const result = await processRepository(tool.repository)

  if (result) {
    const techs = result.childs.flatMap(tech => tech.techs)
    const uniqueTechs = [...new Set(techs)]

    await prisma.tool.update({
      where: { id: tool.id },
      data: { stacks: { set: uniqueTechs.map(tech => ({ slug: tech })) } },
    })
  }
}

// Auth middleware
app.use("*", async (c, next) => {
  const apiKey = c.req.header("X-API-Key")

  if (!apiKey || apiKey !== process.env.AUTH_API_KEY) {
    return c.json({ error: "Unauthorized" }, 401)
  }

  await next()
})

app.post("/", async c => {
  const tools = await prisma.tool.findMany({
    where: { status: { in: [ToolStatus.Published, ToolStatus.Scheduled] } },
    select: { id: true, repository: true },
  })

  try {
    for (const [index, tool] of tools.entries()) {
      console.log(`Processing tool ${index + 1} of ${tools.length}`)

      await processTool(tool)
    }
  } catch (error) {
    return c.json({ error: "Failed to process tools" }, 500)
  }

  return c.json({ success: true })
})

app.post("/:slug", async c => {
  const slug = c.req.param("slug")

  const tool = await prisma.tool.findUnique({
    where: { slug, status: { in: [ToolStatus.Published, ToolStatus.Scheduled] } },
    select: { id: true, repository: true },
  })

  if (!tool) {
    return c.json({ error: "Tool not found" }, 404)
  }

  await processTool(tool)
  return c.json({ success: true })
})

export default app

import { prisma } from "@openalternative/db"
import { ToolStatus } from "@openalternative/db/client"
import type { AllowedKeys } from "@specfy/stack-analyser"
import { Hono } from "hono"
import { StackAnalyzer } from "./analyzer"

const app = new Hono()

app.get("/", async c => {
  const results: AllowedKeys[][] = []

  const tools = await prisma.tool.findMany({
    where: { status: { in: [ToolStatus.Published, ToolStatus.Scheduled] }, slug: "notesnook" },
    select: { id: true, repository: true },
    take: 2,
  })

  try {
    for (const tool of tools) {
      const analyzer = new StackAnalyzer(tool.repository)

      const result = await analyzer.processRepository()

      if (result) {
        const techs = result.childs.flatMap(tech => tech.techs)
        const uniqueTechs = [...new Set(techs)]

        await prisma.tool.update({
          where: { id: tool.id },
          data: { stacks: { set: uniqueTechs.map(tech => ({ slug: tech })) } },
        })
      }
    }
  } catch (error) {
    console.error("Failed to process tools:", error)
  }

  return c.json(results)
})

export default app

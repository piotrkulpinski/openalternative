import { prisma } from "@openalternative/db"
import { ToolStatus } from "@openalternative/db/client"
import type { AllowedKeys } from "@specfy/stack-analyser"
import { Hono } from "hono"
import { StackAnalyzer } from "./analyzer"

const app = new Hono()

app.get("/", async c => {
  const results: AllowedKeys[][] = []

  const tools = await prisma.tool.findMany({
    where: {
      status: { in: [ToolStatus.Published, ToolStatus.Scheduled] },
      stacks: { none: {} },
    },
    select: { id: true, repository: true },
    // take: 15,
  })

  try {
    for (const [index, tool] of tools.entries()) {
      console.log(`Processing tool ${index + 1} of ${tools.length}`)

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

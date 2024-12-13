import { prisma } from "@openalternative/db"
import { ToolStatus } from "@openalternative/db/client"
import { Hono } from "hono"
import { StackAnalyzer } from "./analyzer"

const app = new Hono()

app.get("/", async c => {
  const tools = await prisma.tool.findMany({
    where: { status: { in: [ToolStatus.Published, ToolStatus.Scheduled] } },
    select: { id: true, repository: true },
    take: 2,
  })

  try {
    for (const tool of tools) {
      const analyzer = new StackAnalyzer(tool.repository)

      const result = await analyzer.processRepository()

      if (result) {
        // console.log(result)
        // return c.json(result)
        // await prisma.tool.update({
        //   where: { id: tool.id },
        //   data: { stacks: { set: result.stacks.map(stack => ({ name: stack.name })) } },
        // })
      }
    }
  } catch (error) {
    console.error("Failed to process tools:", error)
  }

  return c.json({ message: "Tools analyzed" })
})

export default app

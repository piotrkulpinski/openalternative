import { prisma } from "@openalternative/db"
import { ToolStatus } from "@openalternative/db/client"
import { revalidateTag } from "next/cache"
import { analyzerApi } from "~/lib/apis"
import { inngest } from "~/services/inngest"

export const analyzeTools = inngest.createFunction(
  { id: "analyze-tools" },
  { cron: "TZ=Europe/Warsaw 0 0 1 * *" }, // Start of the month at midnight

  async ({ step, logger }) => {
    const batchSize = 5

    const tools = await step.run("fetch-tools", async () => {
      return await prisma.tool.findMany({
        where: { status: { in: [ToolStatus.Published, ToolStatus.Scheduled] } },
        select: { id: true, repository: true },
      })
    })

    await step.run("analyze-repository-stacks", async () => {
      for (let i = 0; i < tools.length; i += batchSize) {
        const batch = tools.slice(i, i + batchSize)

        const promises = batch.map(async (tool, index) => {
          logger.info(`Processing batch ${Math.floor(i / batchSize) + 1}, tool ${index + 1}`)

          const { stack } = await analyzerApi.url("/analyze").post(tool)

          await prisma.tool.update({
            where: { id: tool.id },
            data: { stacks: { set: stack.map(slug => ({ slug })) } },
          })
        })

        await Promise.all(promises)
      }
    })

    // Disconnect from DB
    await step.run("disconnect-from-db", async () => {
      return await prisma.$disconnect()
    })

    // Revalidate cache
    await step.run("revalidate-cache", async () => {
      revalidateTag("tools")
      revalidateTag("tool")
    })
  },
)

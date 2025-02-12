import { ToolStatus } from "@openalternative/db/client"
import { revalidateTag } from "next/cache"
import { analyzeRepositoryStack } from "~/lib/stack-analysis"
import { inngest } from "~/services/inngest"

export const analyzeTools = inngest.createFunction(
  { id: "analyze-tools" },
  { cron: "TZ=Europe/Warsaw 0 0 1 * *" }, // Start of the month at midnight

  async ({ step, db, logger }) => {
    const batchSize = 5

    const tools = await step.run("fetch-tools", async () => {
      return await db.tool.findMany({
        where: { status: { in: [ToolStatus.Published, ToolStatus.Scheduled] } },
        select: { id: true, repositoryUrl: true },
      })
    })

    await step.run("analyze-repository-stacks", async () => {
      for (let i = 0; i < tools.length; i += batchSize) {
        const batch = tools.slice(i, i + batchSize)

        const promises = batch.map(async (tool, index) => {
          logger.info(`Processing batch ${Math.floor(i / batchSize) + 1}, tool ${index + 1}`)

          // Get analysis and cache it
          const { stack } = await analyzeRepositoryStack(tool.repositoryUrl)

          // Update tool with new stack
          return await db.tool.update({
            where: { id: tool.id },
            data: { stacks: { set: stack.map(slug => ({ slug })) } },
          })
        })

        await Promise.all(promises)
      }
    })

    // Disconnect from DB
    await step.run("disconnect-from-db", async () => {
      return await db.$disconnect()
    })

    // Revalidate cache
    await step.run("revalidate-cache", async () => {
      revalidateTag("tools")
      revalidateTag("tool")
    })
  },
)

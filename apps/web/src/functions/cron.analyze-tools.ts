import { ToolStatus } from "@openalternative/db/client"
import { revalidateTag } from "next/cache"
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

import { inngest } from "apps/web/app/services.server/inngest"
import { prisma } from "apps/web/app/services.server/prisma"
import { got } from "got"

export const reindexTools = inngest.createFunction(
  { id: "reindex-tools" },
  { cron: "TZ=Europe/Warsaw 10 0 * * *" },
  async ({ step, logger }) => {
    // Clear out empty languages and topics
    await step.run("clear-data", async () => {
      return await Promise.all([
        prisma.language.deleteMany({ where: { tools: { none: {} } } }),
        prisma.topic.deleteMany({ where: { tools: { none: {} } } }),
      ])
    })

    // Run Algolia indexing
    await step.run("run-algolia-indexing", async () => {
      return await got.post(
        `https://data.us.algolia.com/1/tasks/${process.env.ALGOLIA_INDEX_TASK_ID}/run`,
        {
          headers: {
            "X-Algolia-API-Key": process.env.ALGOLIA_ADMIN_API_KEY,
            "X-Algolia-Application-Id": process.env.VITE_ALGOLIA_APP_ID,
          },
        },
      )
    })
  },
)

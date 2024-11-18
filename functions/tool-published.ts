import { inngest } from "~/services/inngest"
import { prisma } from "~/services/prisma"

export const toolPublished = inngest.createFunction(
  { id: "tool.published" },
  { event: "tool.published" },
  async ({ event, step }) => {
    const tool = await step.run("fetch-tool", async () => {
      return prisma.tool.findUniqueOrThrow({ where: { slug: event.data.slug } })
    })

    // TODO: send email to the submitter
  },
)

import { isProd } from "~/env"
import { removeS3Directory } from "~/lib/media"
import { inngest } from "~/services/inngest"

export const toolDeleted = inngest.createFunction(
  { id: "tool.deleted" },
  { event: "tool.deleted" },

  async ({ event, step }) => {
    await step.run("remove-s3-directory", async () => {
      return isProd ? removeS3Directory(`${event.data.slug}`) : Promise.resolve()
    })
  },
)

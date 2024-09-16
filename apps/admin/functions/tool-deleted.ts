import { removeS3Directory } from "~/lib/media"
import { inngest } from "~/services/inngest"

export const toolDeleted = inngest.createFunction(
  { id: "tool.deleted" },
  { event: "tool.deleted" },

  async ({ event, step }) => {
    const { slug } = event.data

    await step.run("remove-s3-directory", async () => {
      return removeS3Directory(`${slug}`)
    })
  },
)

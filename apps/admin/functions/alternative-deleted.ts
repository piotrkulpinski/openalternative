import { removeS3Directory } from "~/lib/media"
import { inngest } from "~/services/inngest"

export const alternativeDeleted = inngest.createFunction(
  { id: "alternative.deleted" },
  { event: "alternative.deleted" },

  async ({ event, step }) => {
    const { slug } = event.data

    await step.run("remove-s3-directory", async () => {
      return removeS3Directory(`alternatives/${slug}`)
    })
  },
)

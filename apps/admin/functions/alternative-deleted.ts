import { isProd } from "~/env"
import { removeS3Directory } from "~/lib/media"
import { inngest } from "~/services/inngest"

export const alternativeDeleted = inngest.createFunction(
  { id: "alternative.deleted" },
  { event: "alternative.deleted" },

  async ({ event, step }) => {
    await step.run("remove-s3-directory", async () => {
      return isProd ? removeS3Directory(`alternatives/${event.data.slug}`) : Promise.resolve()
    })
  },
)

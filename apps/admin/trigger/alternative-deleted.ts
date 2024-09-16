import type { Alternative } from "@openalternative/db"
import { task } from "@trigger.dev/sdk/v3"
import { removeS3Directory } from "~/lib/media"

export const alternativeDeletedTask = task({
  id: "alternative-deleted",
  run: async ({ slug }: Alternative) => {
    await removeS3Directory(`alternatives/${slug}`)
  },
})

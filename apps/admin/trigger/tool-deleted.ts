import type { Tool } from "@openalternative/db"
import { task } from "@trigger.dev/sdk/v3"
import { removeS3Directory } from "~/lib/media"

export const toolDeletedTask = task({
  id: "tool-deleted",
  run: async ({ slug }: Tool) => {
    await removeS3Directory(`${slug}`)
  },
})

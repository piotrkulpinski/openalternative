import { serve } from "inngest/next"
import { alternativeCreated } from "~/functions/alternative-created"
import { alternativeDeleted } from "~/functions/alternative-deleted"
import { fetchToolData } from "~/functions/fetch-tool-data"
import { toolDeleted } from "~/functions/tool-deleted"
import { toolPublished } from "~/functions/tool-published"
import { inngest } from "~/services/inngest"

export const maxDuration = 60

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [fetchToolData, toolPublished, toolDeleted, alternativeCreated, alternativeDeleted],
})

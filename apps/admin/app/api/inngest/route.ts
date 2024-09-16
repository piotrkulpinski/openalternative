import { serve } from "inngest/next"
import { alternativeCreated } from "~/functions/alternative-created"
import { alternativeDeleted } from "~/functions/alternative-deleted"
import { fetchToolData } from "~/functions/fetch-tool-data"
import { toolCreated } from "~/functions/tool-created"
import { toolDeleted } from "~/functions/tool-deleted"
import { inngest } from "~/services/inngest"

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [fetchToolData, toolCreated, toolDeleted, alternativeCreated, alternativeDeleted],
})

import { serve } from "inngest/remix"
import { fetchToolData } from "~/functions.server/fetchToolData"
import { onAlternativeCreated } from "~/functions.server/onAlternativeCreated"
import { onToolCreated } from "~/functions.server/onToolCreated"
import { reindexTools } from "~/functions.server/reindexTools"
import { inngest } from "~/services.server/inngest"

const handler = serve({
  client: inngest,
  functions: [onToolCreated, onAlternativeCreated, fetchToolData, reindexTools],
  streaming: "allow",
})

export { handler as action, handler as loader }

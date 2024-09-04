import { fetchToolData } from "apps/web/app/functions.server/fetchToolData"
import { onAlternativeCreated } from "apps/web/app/functions.server/onAlternativeCreated"
import { onToolCreated } from "apps/web/app/functions.server/onToolCreated"
import { reindexTools } from "apps/web/app/functions.server/reindexTools"
import { inngest } from "apps/web/app/services.server/inngest"
import { serve } from "inngest/remix"

const handler = serve({
  client: inngest,
  functions: [onToolCreated, onAlternativeCreated, fetchToolData, reindexTools],
})

export { handler as action, handler as loader }

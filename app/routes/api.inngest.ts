import { serve } from "inngest/remix"
import { onAlternativeCreated } from "~/functions.server/onAlternativeCreated"
import { onToolCreated } from "~/functions.server/onToolCreated"
import { inngest } from "~/services.server/inngest"

const handler = serve({
  client: inngest,
  functions: [onToolCreated, onAlternativeCreated],
})

export { handler as action, handler as loader }

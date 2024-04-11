import { serve } from "inngest/remix"
import { inngest } from "~/services.server/inngest"
import { onToolCreated } from "~/functions.server/onToolCreated"
import { onAlternativeCreated } from "~/functions.server/onAlternativeCreated"

const handler = serve({
  client: inngest,
  functions: [onToolCreated, onAlternativeCreated],
})

export { handler as action, handler as loader }

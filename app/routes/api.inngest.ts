import { serve } from "inngest/remix"
import { inngest } from "~/services.server/inngest"
import { onToolCreated } from "~/functions.server/onToolCreated"

const handler = serve({
  client: inngest,
  functions: [onToolCreated],
})

export { handler as action, handler as loader }

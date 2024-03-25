import { serve } from "inngest/remix"
import { inngest } from "~/services.server/inngest"
import { functions } from "~/functions.server"

export const config = {
  runtime: "edge",
}

const handler = serve({
  client: inngest,
  functions,
  streaming: "allow",
})

export { handler as action, handler as loader }

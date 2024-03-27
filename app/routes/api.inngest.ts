import { serve } from "inngest/remix"
import { inngest } from "~/services.server/inngest"
import { generateToolScreenshot } from "~/functions.server/generateToolScreenshot"
import { generateToolFavicon } from "~/functions.server/generateToolFavicon"

const handler = serve({
  client: inngest,
  functions: [generateToolScreenshot, generateToolFavicon],
})

export { handler as action, handler as loader }

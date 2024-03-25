import { serve } from "inngest/remix"
import { inngest } from "~/services.server/inngest"
import { generateToolScreenshot } from "~/functions.server/generateToolScreenshot"
import { generateToolFavicon } from "~/functions.server/generateToolFavicon"
import { cronUpdateTools } from "~/functions.server/cronUpdateTools"
import { fetchGithubRepo } from "~/functions.server/fetchGithubRepo"

export const config = {
  runtime: "edge",
}

const handler = serve({
  client: inngest,
  streaming: "allow",
  functions: [cronUpdateTools, fetchGithubRepo, generateToolScreenshot, generateToolFavicon],
})

export { handler as action, handler as loader }

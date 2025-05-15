import { serve } from "inngest/next"
import { analyzeTools } from "~/functions/cron.analyze-tools"
import { fetchData } from "~/functions/cron.fetch-data"
import { indexData } from "~/functions/cron.index-data"
import { publishTools } from "~/functions/cron.publish-tools"
import { inngest } from "~/services/inngest"

export const maxDuration = 60

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [fetchData, indexData, analyzeTools, publishTools],
})

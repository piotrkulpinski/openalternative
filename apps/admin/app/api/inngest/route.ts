import { serve } from "inngest/next"
import { alternativeCreated } from "~/functions/alternative-created"
import { alternativeDeleted } from "~/functions/alternative-deleted"
import { fetchToolData } from "~/functions/cron.fetch-tools"
import { postOnSocials } from "~/functions/cron.post-on-socials"
import { toolDeleted } from "~/functions/tool-deleted"
import { toolExpedited } from "~/functions/tool-expedited"
import { toolFeatured } from "~/functions/tool-featured"
import { toolPublished } from "~/functions/tool-published"
import { toolScheduled } from "~/functions/tool-scheduled"
import { toolSubmitted } from "~/functions/tool-submitted"
import { inngest } from "~/services/inngest"

export const maxDuration = 60

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    fetchToolData,
    postOnSocials,
    toolScheduled,
    toolPublished,
    toolDeleted,
    toolSubmitted,
    toolExpedited,
    toolFeatured,
    alternativeCreated,
    alternativeDeleted,
  ],
})

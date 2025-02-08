import { db } from "@openalternative/db"
import type { createStepTools } from "inngest/components/InngestStepTools"
import type { inngest } from "~/services/inngest"

export const ensureFreeSubmissions = async (
  step: ReturnType<typeof createStepTools<typeof inngest>>,
  slug: string,
  timeout: string,
) => {
  const tool = await db.tool.findUnique({ where: { slug } })

  if (!tool || tool.publishedAt) {
    return false
  }

  const isPremium = await Promise.all([
    step.waitForEvent("wait-for-expedited", {
      event: "tool.expedited",
      match: "data.slug",
      timeout,
    }),

    step.waitForEvent("wait-for-featured", {
      event: "tool.featured",
      match: "data.slug",
      timeout,
    }),
  ])

  return isPremium.every(item => item === null)
}

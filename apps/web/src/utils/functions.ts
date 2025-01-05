import type { createStepTools } from "inngest/components/InngestStepTools"
import type { inngest } from "~/services/inngest"

export const waitForPremiumSubmission = async (
  step: ReturnType<typeof createStepTools<typeof inngest>>,
  timeout: string,
) => {
  return await Promise.all([
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
}

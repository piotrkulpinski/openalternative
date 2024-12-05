"use server"

import { getDistinctId, posthog } from "~/services/posthog"

export const captureEvent = async (event: string, properties?: Record<string | number, any>) => {
  const distinctId = await getDistinctId()
  posthog.capture({ distinctId, event, properties })
}

import wretch from "wretch"
import { env } from "~/env"

export const getPlausibleApi = () => {
  const host = env.NEXT_PUBLIC_PLAUSIBLE_URL
  const apiKey = env.PLAUSIBLE_API_KEY

  return wretch(`${host}/api/v2/query`).auth(`Bearer ${apiKey}`)
}

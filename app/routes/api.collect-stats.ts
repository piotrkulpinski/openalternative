import { kv } from "@vercel/kv"
import { getStarCount, getSubscriberCount, getToolCount } from "~/utils/stats"

export const loader = async () => {
  const tools = await getToolCount()
  const stars = await getStarCount()
  const subscribers = await getSubscriberCount()

  await kv.set("stats", { tools, stars, subscribers })

  return null
}

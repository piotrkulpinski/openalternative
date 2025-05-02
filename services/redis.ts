import { Redis } from "@upstash/redis"
import { env } from "~/env"

export const redis = new Redis({
  url: env.REDIS_REST_URL,
  token: env.REDIS_REST_TOKEN,
})

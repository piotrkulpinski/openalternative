import { remember } from "@epic-web/remember"
import { PrismaClient } from "@prisma/client"

export const prisma = remember("prisma", () => {
  const logThreshold = 50

  const client = new PrismaClient({
    // adapter,
    log: [
      { level: "query", emit: "event" },
      { level: "error", emit: "stdout" },
      { level: "warn", emit: "stdout" },
    ],
  })

  client.$on("query", async e => {
    if (e.duration < logThreshold) return

    console.info(`prisma:query - ${e.duration}ms - ${e.query}`)
  })

  client.$connect()
  return client
})

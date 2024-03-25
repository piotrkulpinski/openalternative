import { remember } from "@epic-web/remember"
import { PrismaClient } from "@prisma/client"
import chalk from "chalk"

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

  client.$on("query", async (e) => {
    if (e.duration < logThreshold) return
    const color =
      e.duration < logThreshold * 1.1
        ? "green"
        : e.duration < logThreshold * 1.2
          ? "blue"
          : e.duration < logThreshold * 1.3
            ? "yellow"
            : e.duration < logThreshold * 1.4
              ? "redBright"
              : "red"

    const dur = chalk[color](`${e.duration}ms`)
    console.info(`prisma:query - ${dur} - ${e.query}`)
  })
  client.$connect()
  return client
})

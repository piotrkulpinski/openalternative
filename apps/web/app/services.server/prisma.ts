import { remember } from "@epic-web/remember"
import { PrismaClient } from "@openalternative/db"

export const prisma = remember("prisma", () => {
  return new PrismaClient()
})

import { prisma } from "~/services.server/prisma"

export const loader = async () => {
  return await prisma.sponsoring.findMany({
    where: { endsAt: { gte: new Date() } },
    select: { startsAt: true, endsAt: true },
  })
}

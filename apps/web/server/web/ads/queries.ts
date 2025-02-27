import { db } from "@openalternative/db"
import type { Prisma } from "@openalternative/db/client"
import { unstable_cacheLife as cacheLife, unstable_cacheTag as cacheTag } from "next/cache"
import { adManyPayload, adOnePayload } from "~/server/web/ads/payloads"

export const findAds = async ({ where, orderBy, ...args }: Prisma.AdFindManyArgs) => {
  "use cache"

  cacheTag("ads")
  cacheLife("hours")

  return db.ad.findMany({
    ...args,
    orderBy: orderBy ?? { startsAt: "desc" },
    select: adManyPayload,
  })
}

export const findAd = async ({ where, orderBy, ...args }: Prisma.AdFindFirstArgs) => {
  "use cache"

  cacheTag("ad")
  cacheLife("minutes")

  return db.ad.findFirst({
    ...args,
    orderBy: orderBy ?? { startsAt: "desc" },
    where: { startsAt: { lte: new Date() }, endsAt: { gt: new Date() }, ...where },
    select: adOnePayload,
  })
}

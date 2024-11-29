import type { Prisma } from "@prisma/client"
import { cache } from "~/lib/cache"
import { licenseManyPayload, licenseOnePayload } from "~/server/licenses/payloads"
import { prisma } from "~/services/prisma"

export const findLicenses = cache(
  async ({ where, orderBy, ...args }: Prisma.LicenseFindManyArgs) => {
    return prisma.license.findMany({
      ...args,
      orderBy: orderBy ?? [{ tools: { _count: "desc" } }, { name: "asc" }],
      where: { tools: { some: { publishedAt: { lte: new Date() } } }, ...where },
      include: licenseManyPayload,
    })
  },
)

export const findLicenseSlugs = cache(
  async ({ where, orderBy, ...args }: Prisma.LicenseFindManyArgs) => {
    return prisma.license.findMany({
      ...args,
      orderBy: orderBy ?? { name: "asc" },
      where: { tools: { some: { publishedAt: { lte: new Date() } } }, ...where },
      select: { slug: true, updatedAt: true },
    })
  },
)

export const findLicense = cache(async ({ ...args }: Prisma.LicenseFindUniqueArgs) => {
  return prisma.license.findUnique({
    ...args,
    include: licenseOnePayload,
  })
})

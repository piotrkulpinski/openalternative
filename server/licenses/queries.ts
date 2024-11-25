import type { Prisma } from "@prisma/client"
import { licenseManyPayload, licenseOnePayload } from "~/server/licenses/payloads"
import { prisma } from "~/services/prisma"

export const findLicenses = async ({ where, orderBy, ...args }: Prisma.LicenseFindManyArgs) => {
  return prisma.license.findMany({
    ...args,
    orderBy: orderBy ?? { tools: { _count: "desc" } },
    where: { tools: { some: { publishedAt: { lte: new Date() } } }, ...where },
    include: licenseManyPayload,
  })
}

export const findLicenseSlugs = async ({ where, orderBy, ...args }: Prisma.LicenseFindManyArgs) => {
  return prisma.license.findMany({
    ...args,
    orderBy: orderBy ?? { name: "asc" },
    where: { tools: { some: { publishedAt: { lte: new Date() } } }, ...where },
    select: { slug: true, updatedAt: true },
  })
}

export const findLicense = async ({ ...args }: Prisma.LicenseFindUniqueArgs) => {
  return prisma.license.findUnique({
    ...args,
    include: licenseOnePayload,
  })
}

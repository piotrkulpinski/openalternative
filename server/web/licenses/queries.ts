import type { Prisma } from "@prisma/client"
import { licenseManyPayload, licenseOnePayload } from "~/server/web/licenses/payloads"
import { prisma } from "~/services/prisma"

export const findLicenses = async ({ where, orderBy, ...args }: Prisma.LicenseFindManyArgs) => {
  "use cache"

  return prisma.license.findMany({
    ...args,
    orderBy: orderBy ?? [{ tools: { _count: "desc" } }, { name: "asc" }],
    where: { tools: { some: { status: "Published" } }, ...where },
    include: licenseManyPayload,
  })
}

export const findLicenseSlugs = async ({ where, orderBy, ...args }: Prisma.LicenseFindManyArgs) => {
  return prisma.license.findMany({
    ...args,
    orderBy: orderBy ?? { name: "asc" },
    where: { tools: { some: { status: "Published" } }, ...where },
    select: { slug: true, updatedAt: true },
  })
}

export const findLicense = async ({ ...args }: Prisma.LicenseFindUniqueArgs) => {
  "use cache"

  return prisma.license.findUnique({
    ...args,
    include: licenseOnePayload,
  })
}

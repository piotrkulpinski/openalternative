import { prisma } from "~/lib/prisma"
import { type Prisma, ToolStatus } from "@openalternative/db/client"
import { licenseManyPayload, licenseOnePayload } from "~/server/licenses/payloads"

export const findLicenses = async ({ where, orderBy, ...args }: Prisma.LicenseFindManyArgs) => {
  return prisma.license.findMany({
    ...args,
    orderBy: orderBy ?? [{ tools: { _count: "desc" } }, { name: "asc" }],
    where: { tools: { some: { status: ToolStatus.Published } }, ...where },
    select: licenseManyPayload,
  })
}

export const findLicenseSlugs = async ({ where, orderBy, ...args }: Prisma.LicenseFindManyArgs) => {
  return prisma.license.findMany({
    ...args,
    orderBy: orderBy ?? { name: "asc" },
    where: { tools: { some: { status: ToolStatus.Published } }, ...where },
    select: { slug: true, updatedAt: true },
  })
}

export const findLicenseBySlug = (
  slug: string,
  { where, ...args }: Prisma.LicenseFindFirstArgs = {},
) => {
  return prisma.license.findFirst({
    ...args,
    where: { slug, ...where },
    select: licenseOnePayload,
  })
}

import { type Prisma, ToolStatus } from "@prisma/client"
import { unstable_cacheTag as cacheTag } from "next/cache"
import { licenseManyPayload, licenseOnePayload } from "~/server/web/licenses/payloads"
import { prisma } from "~/services/prisma"

export const findLicenses = async ({ where, orderBy, ...args }: Prisma.LicenseFindManyArgs) => {
  "use cache"
  cacheTag("licenses")

  return prisma.license.findMany({
    ...args,
    orderBy: orderBy ?? [{ tools: { _count: "desc" } }, { name: "asc" }],
    where: { tools: { some: { status: ToolStatus.Published } }, ...where },
    include: licenseManyPayload,
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

export const findLicenseBySlug = async (
  slug: string,
  { where, ...args }: Prisma.LicenseFindFirstArgs,
) => {
  "use cache"
  cacheTag(`license-${slug}`)

  return prisma.license.findFirst({
    ...args,
    where: { slug, ...where },
    include: licenseOnePayload,
  })
}

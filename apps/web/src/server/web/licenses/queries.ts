import { db } from "@openalternative/db"
import { type Prisma, ToolStatus } from "@openalternative/db/client"
import { unstable_cacheTag as cacheTag } from "next/cache"
import { licenseManyPayload, licenseOnePayload } from "~/server/web/licenses/payloads"

export const findLicenses = async ({ where, orderBy, ...args }: Prisma.LicenseFindManyArgs) => {
  "use cache"

  cacheTag("licenses")

  return db.license.findMany({
    ...args,
    orderBy: orderBy ?? [{ tools: { _count: "desc" } }, { name: "asc" }],
    where: { tools: { some: { status: ToolStatus.Published } }, ...where },
    select: licenseManyPayload,
  })
}

export const findLicenseSlugs = async ({ where, orderBy, ...args }: Prisma.LicenseFindManyArgs) => {
  "use cache"

  cacheTag("licenses")

  return db.license.findMany({
    ...args,
    orderBy: orderBy ?? { name: "asc" },
    where: { tools: { some: { status: ToolStatus.Published } }, ...where },
    select: { slug: true, updatedAt: true },
  })
}

export const findLicense = async ({ where, ...args }: Prisma.LicenseFindFirstArgs = {}) => {
  "use cache"

  cacheTag("license", `license-${where?.slug}`)

  return db.license.findFirst({
    ...args,
    where,
    select: licenseOnePayload,
  })
}

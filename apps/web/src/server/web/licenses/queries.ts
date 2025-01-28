import { db } from "@openalternative/db"
import { type Prisma, ToolStatus } from "@openalternative/db/client"
import { cache } from "~/lib/cache"
import { licenseManyPayload, licenseOnePayload } from "~/server/web/licenses/payloads"

export const findLicenses = cache(
  async ({ where, orderBy, ...args }: Prisma.LicenseFindManyArgs) => {
    return db.license.findMany({
      ...args,
      orderBy: orderBy ?? [{ tools: { _count: "desc" } }, { name: "asc" }],
      where: { tools: { some: { status: ToolStatus.Published } }, ...where },
      select: licenseManyPayload,
    })
  },
  ["licenses"],
)

export const findLicenseSlugs = async ({ where, orderBy, ...args }: Prisma.LicenseFindManyArgs) => {
  return db.license.findMany({
    ...args,
    orderBy: orderBy ?? { name: "asc" },
    where: { tools: { some: { status: ToolStatus.Published } }, ...where },
    select: { slug: true, updatedAt: true },
  })
}

export const findLicenseBySlug = (
  slug: string,
  { where, ...args }: Prisma.LicenseFindFirstArgs = {},
) =>
  cache(
    async (slug: string) => {
      return db.license.findFirst({
        ...args,
        where: { slug, ...where },
        select: licenseOnePayload,
      })
    },
    ["license", `license-${slug}`],
  )(slug)

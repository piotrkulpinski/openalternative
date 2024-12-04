import { type Prisma, ToolStatus } from "@prisma/client"
import { cache } from "~/lib/cache"
import { licenseManyPayload, licenseOnePayload } from "~/server/web/licenses/payloads"
import { prisma } from "~/services/prisma"

export const findLicenses = cache(
  async ({ where, orderBy, ...args }: Prisma.LicenseFindManyArgs) => {
    return prisma.license.findMany({
      ...args,
      orderBy: orderBy ?? [{ tools: { _count: "desc" } }, { name: "asc" }],
      where: { tools: { some: { status: ToolStatus.Published } }, ...where },
      include: licenseManyPayload,
    })
  },
  ["licenses"],
)

export const findLicenseSlugs = async ({ where, orderBy, ...args }: Prisma.LicenseFindManyArgs) => {
  return prisma.license.findMany({
    ...args,
    orderBy: orderBy ?? { name: "asc" },
    where: { tools: { some: { status: ToolStatus.Published } }, ...where },
    select: { slug: true, updatedAt: true },
  })
}

export const findLicenseBySlug = (slug: string) =>
  cache(
    async (slug: string) => {
      return prisma.license.findFirst({
        where: { slug },
        include: licenseOnePayload,
      })
    },
    ["license", `license-${slug}`],
  )(slug)

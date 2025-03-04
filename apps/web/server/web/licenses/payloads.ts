import { Prisma, ToolStatus } from "@openalternative/db/client"

export const licenseOnePayload = Prisma.validator<Prisma.LicenseSelect>()({
  name: true,
  slug: true,
  _count: { select: { tools: { where: { status: ToolStatus.Published } } } },
})

export const licenseManyPayload = Prisma.validator<Prisma.LicenseSelect>()({
  slug: true,
  name: true,
  _count: { select: { tools: { where: { status: ToolStatus.Published } } } },
})

export type LicenseOne = Prisma.LicenseGetPayload<{ select: typeof licenseOnePayload }>
export type LicenseMany = Prisma.LicenseGetPayload<{ select: typeof licenseManyPayload }>

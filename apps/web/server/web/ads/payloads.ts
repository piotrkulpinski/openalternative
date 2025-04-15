import { Prisma } from "@openalternative/db/client"

export const adOnePayload = Prisma.validator<Prisma.AdSelect>()({
  name: true,
  description: true,
  websiteUrl: true,
  buttonLabel: true,
  faviconUrl: true,
  type: true,
})

export const adManyPayload = Prisma.validator<Prisma.AdSelect>()({
  type: true,
  startsAt: true,
  endsAt: true,
})

export type AdOne = Prisma.AdGetPayload<{ select: typeof adOnePayload }>
export type AdMany = Prisma.AdGetPayload<{ select: typeof adManyPayload }>

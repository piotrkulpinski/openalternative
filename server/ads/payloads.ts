import { Prisma } from "@prisma/client"

export const adOnePayload = Prisma.validator<Prisma.AdSelect>()({
  name: true,
  description: true,
  website: true,
  faviconUrl: true,
  type: true,
})

export type AdOne = Prisma.AdGetPayload<{ select: typeof adOnePayload }>

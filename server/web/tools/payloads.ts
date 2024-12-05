import { Prisma } from "@prisma/client"

export const toolOnePayload = Prisma.validator<Prisma.ToolSelect>()({
  name: true,
  slug: true,
  website: true,
  repository: true,
  tagline: true,
  description: true,
  content: true,
  links: true,
  stars: true,
  forks: true,
  faviconUrl: true,
  screenshotUrl: true,
  isFeatured: true,
  hostingUrl: true,
  discountCode: true,
  discountAmount: true,
  firstCommitDate: true,
  lastCommitDate: true,
  publishedAt: true,
  updatedAt: true,
  license: true,
  alternatives: {
    include: { alternative: true },
    orderBy: [{ alternative: { tools: { _count: "desc" } } }, { alternative: { name: "asc" } }],
  },
  categories: {
    include: { category: true },
    orderBy: { category: { name: "asc" } },
  },
  languages: {
    include: { language: true },
    orderBy: [{ percentage: "desc" }],
  },
  topics: {
    include: { topic: true },
    orderBy: { topic: { slug: "asc" } },
  },
})

export const toolManyPayload = Prisma.validator<Prisma.ToolSelect>()({
  name: true,
  slug: true,
  tagline: true,
  stars: true,
  forks: true,
  faviconUrl: true,
  discountAmount: true,
  firstCommitDate: true,
  lastCommitDate: true,
  publishedAt: true,
  updatedAt: true,
})

export const toolManyExtendedPayload = Prisma.validator<Prisma.ToolSelect>()({
  name: true,
  slug: true,
  description: true,
  content: true,
  faviconUrl: true,
  screenshotUrl: true,
  discountCode: true,
  discountAmount: true,
  firstCommitDate: true,
  publishedAt: true,
  updatedAt: true,
  categories: { include: { category: true } },
})

export type ToolOne = Prisma.ToolGetPayload<{ select: typeof toolOnePayload }>
export type ToolMany = Prisma.ToolGetPayload<{ select: typeof toolManyPayload }>
export type ToolManyExtended = Prisma.ToolGetPayload<{ select: typeof toolManyExtendedPayload }>

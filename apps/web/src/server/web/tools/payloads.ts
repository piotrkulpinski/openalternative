import { Prisma } from "@openalternative/db/client"
import { alternativeManyPayload } from "~/server/web/alternatives/payloads"
import { categoryManyPayload } from "~/server/web/categories/payloads"
import { stackManyPayload } from "~/server/web/stacks/payloads"
import { topicManyPayload } from "~/server/web/topics/payloads"

export const toolAlternativesPayload = Prisma.validator<Prisma.Tool$alternativesArgs>()({
  select: alternativeManyPayload,
  orderBy: [{ tools: { _count: "desc" } }, { isFeatured: "desc" }, { name: "asc" }],
})

export const toolCategoriesPayload = Prisma.validator<Prisma.Tool$categoriesArgs>()({
  select: categoryManyPayload,
  orderBy: { name: "asc" },
})

export const toolTopicsPayload = Prisma.validator<Prisma.Tool$topicsArgs>()({
  select: topicManyPayload,
  orderBy: { slug: "asc" },
})

export const toolStackPayload = Prisma.validator<Prisma.Tool$stacksArgs>()({
  select: stackManyPayload,
  orderBy: [{ tools: { _count: "desc" } }, { slug: "asc" }],
})

export const toolOnePayload = Prisma.validator<Prisma.ToolSelect>()({
  name: true,
  slug: true,
  website: true,
  repository: true,
  tagline: true,
  description: true,
  content: true,
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
  status: true,
  publishedAt: true,
  updatedAt: true,
  license: true,
  alternatives: toolAlternativesPayload,
  categories: toolCategoriesPayload,
  topics: toolTopicsPayload,
  stacks: toolStackPayload,
})

export const toolManyPayload = Prisma.validator<Prisma.ToolSelect>()({
  name: true,
  slug: true,
  tagline: true,
  description: true,
  stars: true,
  forks: true,
  faviconUrl: true,
  discountAmount: true,
  firstCommitDate: true,
  lastCommitDate: true,
  publishedAt: true,
  updatedAt: true,
  alternatives: { ...toolAlternativesPayload, take: 1 },
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
  categories: true,
})

export type ToolOne = Prisma.ToolGetPayload<{ select: typeof toolOnePayload }>
export type ToolMany = Prisma.ToolGetPayload<{ select: typeof toolManyPayload }>
export type ToolManyExtended = Prisma.ToolGetPayload<{ select: typeof toolManyExtendedPayload }>

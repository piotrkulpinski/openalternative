"use server"

import { db } from "@openalternative/db"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { z } from "zod"
import { createServerAction } from "zsa"
import { auth } from "~/lib/auth"
import { findAlternatives } from "~/server/web/alternatives/queries"
import { findCategories } from "~/server/web/categories/queries"
import { findLicenses } from "~/server/web/licenses/queries"
import { findStacks } from "~/server/web/stacks/queries"
import type { FilterOption, FilterType } from "~/types/search"

export const findFilterOptions = createServerAction().handler(
  async (): Promise<Record<FilterType, FilterOption[]>> => {
    const [alternative, category, stack, license] = await Promise.all([
      findAlternatives({}).then(r =>
        r.map(({ slug, name, _count }) => ({ slug, name, count: _count.tools })),
      ),
      findCategories({}).then(r =>
        r.map(({ slug, name, _count }) => ({ slug, name, count: _count.tools })),
      ),
      findStacks({}).then(r =>
        r.map(({ slug, name, _count }) => ({ slug, name, count: _count.tools })),
      ),
      findLicenses({}).then(r =>
        r.map(({ slug, name, _count }) => ({ slug, name, count: _count.tools })),
      ),
    ])

    return {
      alternative,
      category,
      stack,
      license,
    }
  },
)

export const toggleBookmark = createServerAction()
  .input(z.object({ toolSlug: z.string(), callbackUrl: z.string() }))
  .handler(async ({ input }) => {
    try {
      const session = await auth.api.getSession({ headers: await headers() })

      if (!session?.user) {
        redirect(`/login?callbackUrl=${encodeURIComponent(input.callbackUrl)}`)
      }

      const tool = await db.tool.findUnique({
        where: { slug: input.toolSlug },
        select: { id: true },
      })

      if (!tool) {
        return { success: false, error: "Tool not found" }
      }

      const existingBookmark = await db.bookmark.findUnique({
        where: {
          userId_toolId: {
            userId: session.user.id,
            toolId: tool.id,
          },
        },
      })

      if (existingBookmark) {
        await db.bookmark.delete({
          where: { id: existingBookmark.id },
        })
        return { success: true, data: { bookmarked: false } }
      }

      await db.bookmark.create({
        data: {
          userId: session.user.id,
          toolId: tool.id,
        },
      })

      return { success: true, data: { bookmarked: true } }
    } catch (error) {
      console.error("Failed to bookmark:", error)
      return { success: false, error: "Failed to bookmark" }
    }
  })

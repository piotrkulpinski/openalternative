"use server"

import { db } from "@openalternative/db"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { z } from "zod"
import { createServerAction } from "zsa"
import { auth } from "~/lib/auth"

export const toggleBookmark = createServerAction()
  .input(z.object({ toolSlug: z.string(), callbackURL: z.string() }))
  .handler(async ({ input }) => {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session?.user) {
      throw redirect(`/auth/login?callbackURL=${encodeURIComponent(input.callbackURL)}`)
    }

    try {
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

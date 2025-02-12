"use server"

import { getUrlHostname } from "@curiousleaf/utils"
import { db } from "@openalternative/db"
import { revalidateTag } from "next/cache"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { z } from "zod"
import { createServerAction } from "zsa"
import { auth } from "~/lib/auth"

export const claimTool = createServerAction()
  .input(z.object({ toolSlug: z.string(), callbackURL: z.string() }))
  .handler(async ({ input }) => {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session?.user) {
      throw redirect(`/auth/login?callbackURL=${encodeURIComponent(input.callbackURL)}`)
    }

    const tool = await db.tool.findUniqueOrThrow({
      where: { slug: input.toolSlug },
      select: { id: true, slug: true, websiteUrl: true, ownerId: true },
    })

    if (tool.ownerId) {
      throw new Error("This tool has already been claimed.")
    }

    // Check if user's email domain matches the tool's website domain
    if (!session.user.email.includes(getUrlHostname(tool.websiteUrl))) {
      throw new Error("Your email domain must match the tool's website domain to claim it.")
    }

    try {
      await db.tool.update({
        where: { id: tool.id },
        data: { ownerId: session.user.id },
      })

      // Revalidate cache
      revalidateTag(`tool-${tool.slug}`)

      return { success: true }
    } catch (error) {
      console.error("Failed to claim tool:", error)
      return { success: false, error: "Failed to claim this tool. Please try again later." }
    }
  })

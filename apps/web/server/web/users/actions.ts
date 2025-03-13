"use server"

import { getRandomString, getUrlHostname } from "@curiousleaf/utils"
import { db } from "@openalternative/db"
import { revalidateTag } from "next/cache"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { z } from "zod"
import { auth } from "~/lib/auth"
import { uploadToS3Storage } from "~/lib/media"
import { userProcedure } from "~/lib/safe-actions"

const VALID_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]

export const uploadUserImage = userProcedure
  .createServerAction()
  .input(
    z.object({
      id: z.string(),
      file: z
        .instanceof(File)
        .refine(async ({ size }) => size > 0, "File cannot be empty")
        .refine(async ({ size }) => size < 1024 * 512, "File size must be less than 512KB")
        .refine(async ({ type }) => VALID_IMAGE_TYPES.includes(type), "File must be a valid image"),
    }),
  )
  .handler(async ({ input: { id, file } }) => {
    const buffer = Buffer.from(await file.arrayBuffer())
    const extension = file.name.split(".").pop() || "jpg"
    const key = `users/${id}/${getRandomString()}.${extension}`
    const imageUrl = await uploadToS3Storage(buffer, key)

    return imageUrl
  })

export const claimTool = userProcedure
  .createServerAction()
  .input(z.object({ toolSlug: z.string() }))
  .handler(async ({ input: { toolSlug: slug } }) => {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session?.user) {
      throw redirect(`/auth/login?next=/${slug}`)
    }

    const tool = await db.tool.findUniqueOrThrow({
      where: { slug },
      select: { id: true, slug: true, websiteUrl: true, ownerId: true },
    })

    if (tool.ownerId) {
      throw new Error("This tool has already been claimed.")
    }

    // Check if user's email domain matches the tool's website domain
    if (!session.user.email.includes(getUrlHostname(tool.websiteUrl))) {
      throw new Error("Your email domain must match the tool's website domain to claim it.")
    }

    await db.tool.update({
      where: { id: tool.id },
      data: { ownerId: session.user.id },
    })

    // Revalidate cache
    revalidateTag(`tool-${tool.slug}`)

    return { success: true }
  })

"use server"

import { getRandomString } from "@curiousleaf/utils"
import { z } from "zod"
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

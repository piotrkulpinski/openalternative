"use server"

import { z } from "zod"
import { uploadScreenshot } from "~/lib/media"
import { uploadFavicon } from "~/lib/media"
import { adminProcedure } from "~/lib/safe-actions"

const mediaSchema = z.object({
  url: z.string().min(1).url(),
  path: z.string().min(1),
})

export const generateFavicon = adminProcedure
  .createServerAction()
  .input(mediaSchema)
  .handler(async ({ input: { url, path } }) => uploadFavicon(url, path))

export const generateScreenshot = adminProcedure
  .createServerAction()
  .input(mediaSchema)
  .handler(async ({ input: { url, path } }) => uploadScreenshot(url, path))

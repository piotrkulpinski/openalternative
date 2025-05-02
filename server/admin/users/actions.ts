"use server"

import { revalidatePath } from "next/cache"
import { after } from "next/server"
import { z } from "zod"
import { removeS3Directories } from "~/lib/media"
import { adminProcedure } from "~/lib/safe-actions"
import { userSchema } from "~/server/admin/users/schema"
import { db } from "~/services/db"

export const updateUser = adminProcedure
  .createServerAction()
  .input(userSchema.extend({ id: z.string() }))
  .handler(async ({ input: { id, ...input } }) => {
    const user = await db.user.update({
      where: { id },
      data: input,
    })

    revalidatePath("/admin/users")

    return user
  })

export const deleteUsers = adminProcedure
  .createServerAction()
  .input(z.object({ ids: z.array(z.string()) }))
  .handler(async ({ input: { ids } }) => {
    await db.user.deleteMany({
      where: { id: { in: ids }, role: { not: "admin" } },
    })

    revalidatePath("/admin/users")

    // Remove the user images from S3 asynchronously
    after(async () => {
      await removeS3Directories(ids.map(id => `users/${id}`))
    })

    return true
  })

"use server"

import { db } from "@openalternative/db"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { adminProcedure } from "~/lib/safe-actions"
import { userSchema } from "~/server/admin/users/schemas"

export const updateUser = adminProcedure
  .createServerAction()
  .input(userSchema.extend({ id: z.string() }))
  .handler(async ({ input: { id, ...input } }) => {
    const user = await db.user.update({
      where: { id },
      data: input,
    })

    return user
  })

export const deleteUsers = adminProcedure
  .createServerAction()
  .input(z.object({ ids: z.array(z.string()) }))
  .handler(async ({ input: { ids } }) => {
    await db.user.deleteMany({
      where: { id: { in: ids } },
    })

    revalidatePath("/admin/users")

    return true
  })

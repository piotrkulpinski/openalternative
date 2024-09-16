"use server"

import type { Prisma, Tool } from "@openalternative/db"
import { tasks } from "@trigger.dev/sdk/v3"
import { unstable_noStore as noStore, revalidatePath } from "next/cache"
import { getErrorMessage } from "~/lib/handle-error"
import { prisma } from "~/services/prisma"
import type { toolCreatedTask } from "~/trigger/tool-created"
import type { toolDeletedTask } from "~/trigger/tool-deleted"

export async function createTool(input: Prisma.ToolCreateInput) {
  noStore()
  try {
    const tool = await prisma.tool.create({
      data: input,
    })

    revalidatePath("/tools")

    // Trigger the background task
    await tasks.trigger<typeof toolCreatedTask>("tool-created", tool)

    return {
      data: tool,
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    }
  }
}

export async function updateTool(id: string, input: Prisma.ToolUpdateInput) {
  noStore()
  try {
    const tool = await prisma.tool.update({
      where: { id },
      data: input,
    })

    revalidatePath("/tools")

    return {
      data: tool,
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    }
  }
}

export async function updateTools(input: { ids: Tool["id"][]; data: Prisma.ToolUpdateInput }) {
  noStore()
  try {
    await prisma.tool.updateMany({
      where: { id: { in: input.ids } },
      data: input.data,
    })

    revalidatePath("/tools")

    return {
      data: null,
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    }
  }
}

export async function deleteTool(input: { id: Tool["id"] }) {
  await deleteTools({ ids: [input.id] })
}

export async function deleteTools(input: { ids: Tool["id"][] }) {
  try {
    const tools = await prisma.tool.findMany({
      where: { id: { in: input.ids } },
    })

    await prisma.tool.deleteMany({
      where: { id: { in: input.ids } },
    })

    revalidatePath("/tools")

    // Trigger the background task
    for (const tool of tools) {
      await tasks.trigger<typeof toolDeletedTask>("tool-deleted", tool)
    }

    return {
      data: null,
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    }
  }
}

"use server"

import type { Prisma, Tool } from "@openalternative/db"
import slugify from "@sindresorhus/slugify"
import { unstable_noStore as noStore, revalidatePath } from "next/cache"
import { getErrorMessage } from "~/lib/handle-error"
import { prisma } from "~/services/prisma"
import type { CreateToolSchema } from "./validations"

export async function createTool(input: CreateToolSchema) {
  noStore()
  try {
    await prisma.tool.create({
      data: {
        ...input,
        slug: slugify(input.name),
      },
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

export async function updateTool(id: string, input: Prisma.ToolUpdateInput) {
  noStore()
  try {
    await prisma.tool.update({
      where: { id },
      data: input,
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
  try {
    await prisma.tool.delete({
      where: { id: input.id },
    })

    revalidatePath("/tools")
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    }
  }
}

export async function deleteTools(input: { ids: Tool["id"][] }) {
  try {
    await prisma.tool.deleteMany({
      where: { id: { in: input.ids } },
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

export async function getChunkedTools(input: { chunkSize?: number } = {}) {
  try {
    const chunkSize = input.chunkSize ?? 1000

    const totalTools = await prisma.tool.count()
    const totalChunks = Math.ceil(totalTools / chunkSize)

    let chunkedTools: Tool[] = []

    for (let i = 0; i < totalChunks; i++) {
      chunkedTools = await prisma.tool.findMany({
        take: chunkSize,
        skip: i * chunkSize,
      })
    }

    return {
      data: chunkedTools,
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    }
  }
}

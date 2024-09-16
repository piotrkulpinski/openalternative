"use server"

import type { Prisma, Tool } from "@openalternative/db"
import { unstable_noStore as noStore, revalidatePath } from "next/cache"
import { getErrorMessage } from "~/lib/handle-error"
import { prisma } from "~/services/prisma"
import { inngest } from "~/services/inngest"
import { sendTweet } from "~/services/twitter"

export async function createTool(input: Prisma.ToolCreateInput) {
  noStore()
  try {
    const tool = await prisma.tool.create({
      data: input,
    })

    revalidatePath("/tools")

    // Send an event to the Inngest pipeline
    await inngest.send({ name: "tool.created", data: { id: tool.id } })

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
    revalidatePath(`/tools/${tool.slug}`)

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
      select: { slug: true },
    })

    await prisma.tool.deleteMany({
      where: { id: { in: input.ids } },
    })

    revalidatePath("/tools")

    // Send an event to the Inngest pipeline
    for (const tool of tools) {
      await inngest.send({ name: "tool.deleted", data: { slug: tool.slug } })
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

export async function testTwitter() {
  await sendTweet("Hello, world!")
}

export async function publishTool(id: Tool["id"], publishedAt: Date) {
  try {
    const tool = await prisma.tool.update({
      where: { id },
      data: { publishedAt },
    })

    revalidatePath("/tools")
    revalidatePath(`/tools/${tool.slug}`)

    // Send an event to the Inngest pipeline
    await inngest.send({ name: "tool.published", data: { id: tool.id } })

    return {
      data: null,
      error: null,
    }
  } catch (err) {
    console.error("Tool publishing failed: ", err)

    return {
      data: null,
      error: getErrorMessage(err),
    }
  }
}

import { inngest } from "~/services.server/inngest"
import { prisma } from "~/services.server/prisma"

export const loader = async () => {
  const tool = await prisma.tool.findFirst({})

  // for (const tool of tools) {
  await inngest.send({ event: "tool.created", data: tool })
  // }

  return "ok"
}

import { generateContent } from "~/lib/generate-content"
import { uploadFavicon, uploadScreenshot } from "~/lib/media"
import { getToolRepositoryData } from "~/lib/repositories"
import { getSocialsFromUrl } from "~/lib/socials"
import { inngest } from "~/services/inngest"
import { prisma } from "~/services/prisma"

export const toolScheduled = inngest.createFunction(
  { id: "tool.scheduled" },
  { event: "tool.scheduled" },

  async ({ event, step }) => {
    const tool = await step.run("find-tool", async () => {
      return prisma.tool.findUniqueOrThrow({ where: { id: event.data.id } })
    })

    // Run steps in parallel
    await Promise.all([
      step.run("generate-content", async () => {
        const { categories, alternatives, ...content } = await generateContent(tool)

        return prisma.tool.update({
          where: { id: tool.id },
          data: {
            ...content,

            categories: {
              connectOrCreate: categories.map(({ id }) => ({
                where: { toolId_categoryId: { toolId: tool.id, categoryId: id } },
                create: { category: { connect: { id } } },
              })),
            },

            alternatives: {
              connectOrCreate: alternatives.map(({ id }) => ({
                where: { toolId_alternativeId: { toolId: tool.id, alternativeId: id } },
                create: { alternative: { connect: { id } } },
              })),
            },
          },
        })
      }),

      step.run("fetch-repository-data", async () => {
        const data = await getToolRepositoryData(tool)

        if (!data) return

        return prisma.tool.update({
          where: { id: tool.id },
          data,
        })
      }),

      step.run("upload-favicon", async () => {
        const { id, slug, website } = tool
        const faviconUrl = await uploadFavicon(website, `${slug}/favicon`)

        return prisma.tool.update({
          where: { id },
          data: { faviconUrl },
        })
      }),

      step.run("upload-screenshot", async () => {
        const { id, slug, website } = tool
        const screenshotUrl = await uploadScreenshot(website, `${slug}/screenshot`)

        return prisma.tool.update({
          where: { id },
          data: { screenshotUrl },
        })
      }),

      step.run("get-socials", async () => {
        const socials = await getSocialsFromUrl(tool.website)

        const links = Object.entries(socials)
          .filter(([name]) => name !== "GitHub")
          .map(([name, links]) => ({ name, url: links[0]?.url }))

        const twitterHandle = socials.X?.[0]?.user

        return prisma.tool.update({
          where: { id: tool.id },
          data: { twitterHandle, links },
        })
      }),
    ])

    // Disconnect from DB
    await step.run("disconnect-from-db", async () => {
      return prisma.$disconnect()
    })
  },
)

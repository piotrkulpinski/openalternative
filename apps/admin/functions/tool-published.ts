import { generateAlternatives, generateCategories, generateContent } from "~/lib/generate-content"
import { uploadFavicon, uploadScreenshot } from "~/lib/media"
import { getToolRepositoryData } from "~/lib/repositories"
import { inngest } from "~/services/inngest"
import { prisma } from "~/services/prisma"

export const toolPublished = inngest.createFunction(
  { id: "tool.published" },
  { event: "tool.published" },

  async ({ event, step }) => {
    const tool = await step.run("find-tool", async () => {
      return prisma.tool.findUniqueOrThrow({ where: { id: event.data.id } })
    })

    const content = await step.run("generate-content", async () => {
      return generateContent(tool)
    })

    const repoDataPromise = step.run("fetch-repository-data", async () => {
      return getToolRepositoryData(tool)
    })

    const faviconPromise = step.run("upload-favicon", async () => {
      return uploadFavicon(tool.website, `${tool.slug}/favicon`)
    })

    const screenshotPromise = step.run("upload-screenshot", async () => {
      return uploadScreenshot(tool.website, `${tool.slug}/screenshot`)
    })

    const categoriesPromise = step.run("generate-categories", async () => {
      return generateCategories(`${tool.name}: ${content.description}`)
    })

    const alternativesPromise = step.run("generate-alternatives", async () => {
      return generateAlternatives(`${tool.name}: ${content.description}`)
    })

    // Run steps in parallel
    const [repoData, faviconUrl, screenshotUrl, categories, alternatives] = await Promise.all([
      repoDataPromise,
      faviconPromise,
      screenshotPromise,
      categoriesPromise,
      alternativesPromise,
    ])

    // Update tool in the database
    await step.run("update-tool", async () => {
      return prisma.tool.update({
        where: { id: tool.id },
        data: {
          ...repoData,
          ...content,
          faviconUrl,
          screenshotUrl,

          categories: {
            create: categories.map(({ id }) => ({
              category: { connect: { id } },
            })),
          },

          alternatives: {
            create: alternatives.map(({ id }) => ({
              alternative: { connect: { id } },
            })),
          },
        },
      })
    })
  },
)

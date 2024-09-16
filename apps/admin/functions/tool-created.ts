import { generateContent } from "~/lib/generate-content"
import { uploadFavicon, uploadScreenshot } from "~/lib/media"
import { fetchRepositoryData } from "~/lib/repositories"
import { inngest } from "~/services/inngest"
import { prisma } from "~/services/prisma"

export const toolCreated = inngest.createFunction(
  { id: "tool.created" },
  { event: "tool.created" },

  async ({ event, step }) => {
    const tool = await step.run("find-tool", async () => {
      return prisma.tool.findUniqueOrThrow({ where: { id: event.data.id } })
    })

    const generateContentStep = step.run("generate-content", async () => {
      return generateContent(tool)
    })

    const fetchRepositoryDataStep = step.run("fetch-repository-data", async () => {
      return fetchRepositoryData(tool)
    })

    const uploadAssetsStep = step.run("upload-assets", async () => {
      return Promise.all([
        uploadFavicon(tool.website, `${tool.slug}/favicon`),
        uploadScreenshot(tool.website, `${tool.slug}/screenshot`),
      ])
    })

    // Run all steps in parallel
    const [content, repositoryData, [faviconUrl, screenshotUrl]] = await Promise.all([
      generateContentStep,
      fetchRepositoryDataStep,
      uploadAssetsStep,
    ])

    // Update tool in the database
    await step.run("update-tool", async () => {
      return prisma.tool.update({
        where: { id: tool.id },
        data: {
          ...repositoryData,
          ...content,
          faviconUrl,
          screenshotUrl,
        },
      })
    })
  },
)

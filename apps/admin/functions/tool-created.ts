import {
  findTwitterHandle,
  generateAlternatives,
  generateCategories,
  generateContent,
} from "~/lib/generate-content"
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

    const generateContentPromise = step.run("generate-content", async () => {
      return generateContent(tool)
    })

    const fetchRepositoryDataPromise = step.run("fetch-repository-data", async () => {
      return fetchRepositoryData(tool)
    })

    const uploadAssetsPromise = step.run("upload-assets", async () => {
      return Promise.all([
        uploadFavicon(tool.website, `${tool.slug}/favicon`),
        uploadScreenshot(tool.website, `${tool.slug}/screenshot`),
      ])
    })

    // Run steps in parallel
    const [content, repositoryData, [faviconUrl, screenshotUrl]] = await Promise.all([
      generateContentPromise,
      fetchRepositoryDataPromise,
      uploadAssetsPromise,
    ])

    const twitterHandlePromise = step.run("get-twitter-handle", async () => {
      return findTwitterHandle(content.links)
    })

    const categoriesPromise = step.run("generate-categories", async () => {
      return generateCategories(`${tool.name}: ${content.description}`)
    })

    const alternativesPromise = step.run("generate-alternatives", async () => {
      return generateAlternatives(`${tool.name}: ${content.description}`)
    })

    // Run steps in parallel
    const [twitterHandle, categories, alternatives] = await Promise.all([
      twitterHandlePromise,
      categoriesPromise,
      alternativesPromise,
    ])

    const filteredCategoriesPromise = step.run("filter-categories", async () => {
      return prisma.category.findMany({
        where: {
          name: { in: categories },
          NOT: { tools: { some: { toolId: tool.id } } },
        },
      })
    })

    const filteredAlternativesPromise = step.run("filter-alternatives", async () => {
      return prisma.alternative.findMany({
        where: {
          name: { in: alternatives },
          NOT: { tools: { some: { toolId: tool.id } } },
        },
      })
    })

    const [filteredCategories, filteredAlternatives] = await Promise.all([
      filteredCategoriesPromise,
      filteredAlternativesPromise,
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
          twitterHandle,

          categories: {
            create: filteredCategories.map(category => ({
              category: { connect: { slug: category.slug } },
            })),
          },

          alternatives: {
            create: filteredAlternatives.map(alternative => ({
              alternative: { connect: { slug: alternative.slug } },
            })),
          },
        },
      })
    })
  },
)

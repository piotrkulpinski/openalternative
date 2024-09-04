import { slugify } from "@curiousleaf/utils"
import { inngest } from "apps/web/app/services.server/inngest"
import { prisma } from "apps/web/app/services.server/prisma"
import { fetchRepository } from "apps/web/app/utils/github"
import { sendMilestoneTweet } from "apps/web/app/utils/twitter"

export const fetchToolData = inngest.createFunction(
  { id: "fetch-tool-data" },
  { cron: "TZ=Europe/Warsaw 0 0 * * *" },
  async ({ step, logger }) => {
    const tools = await step.run("find-tools", async () => {
      return await prisma.tool.findMany({
        where: { publishedAt: { not: null } },
      })
    })

    await Promise.all(
      tools.map(
        async tool =>
          await step.run(`update-tool-${tool.id}`, async () => {
            const repo = await fetchRepository(tool)

            if (repo) {
              const {
                stars,
                forks,
                license,
                lastCommitDate,
                score,
                topics,
                languages,
                reachedMilestone,
              } = repo

              // License
              const licenseData = license && {
                connectOrCreate: {
                  where: { name: license },
                  create: {
                    name: license,
                    slug: slugify(license).replace(/-0$/, ""),
                  },
                },
              }

              // Topics
              const topicData = {
                connectOrCreate: topics.map(({ slug }) => ({
                  where: {
                    toolId_topicSlug: {
                      toolId: tool.id,
                      topicSlug: slug,
                    },
                  },
                  create: {
                    topic: {
                      connectOrCreate: {
                        where: { slug },
                        create: { slug },
                      },
                    },
                  },
                })),
              }

              // Languages
              const languageData = {
                connectOrCreate: languages.map(({ percentage, name, slug, color }) => ({
                  where: {
                    toolId_languageSlug: {
                      toolId: tool.id,
                      languageSlug: slug,
                    },
                  },
                  create: {
                    percentage,
                    language: {
                      connectOrCreate: {
                        where: { slug },
                        create: { name, slug, color },
                      },
                    },
                  },
                })),
              }

              if (reachedMilestone) {
                logger.info(`Sending milestone tweet for ${tool.name}`)
                await sendMilestoneTweet(tool, stars)
              }

              return prisma.tool.update({
                where: { id: tool.id },
                data: {
                  stars,
                  forks,
                  lastCommitDate,
                  score,
                  license: licenseData || undefined,
                  topics: topicData,
                  languages: languageData,
                },
              })
            }
          }),
      ),
    )

    await step.run("disconnect", async () => {
      await prisma.$disconnect()
    })
  },
)

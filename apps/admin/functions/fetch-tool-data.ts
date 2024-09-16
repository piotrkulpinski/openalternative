import { env } from "~/env"
import { getMilestoneReached, sendMilestoneTweet } from "~/lib/milestones"
import { fetchRepository } from "~/lib/repositories"
import { inngest } from "~/services/inngest"
import { prisma } from "~/services/prisma"
import { getSlug } from "~/utils/helpers"

export const fetchToolData = inngest.createFunction(
  { id: "fetch-tool-data" },
  { cron: "TZ=Europe/Warsaw 0 0 * * *" },

  async ({ step }) => {
    const tools = await step.run("fetch-tools", async () => {
      return prisma.tool.findMany({
        where: { publishedAt: { not: null } },
      })
    })

    await step.run("fetch-repository-data", async () => {
      return Promise.all(
        tools.map(async tool => {
          const repo = await fetchRepository(tool.repository, tool.bump)

          if (repo) {
            const { stars, forks, license, lastCommitDate, score, topics, languages } = repo
            const milestone = getMilestoneReached(tool.stars, stars)

            // License
            const licenseData = license && {
              connectOrCreate: {
                where: { name: license },
                create: {
                  name: license,
                  slug: getSlug(license).replace(/-0$/, ""),
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

            if (milestone) {
              await sendMilestoneTweet(milestone, tool.name, tool.slug)
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
      )
    })

    // Run cleanup
    await step.run("cleanup", async () => {
      return Promise.all([
        prisma.language.deleteMany({ where: { tools: { none: {} } } }),
        prisma.topic.deleteMany({ where: { tools: { none: {} } } }),
      ])
    })

    // Run Algolia index
    await step.run("run-algolia-index", async () => {
      return fetch(`https://data.us.algolia.com/1/tasks/${env.ALGOLIA_INDEX_TASK_ID}/run`, {
        method: "POST",
        headers: {
          "X-Algolia-API-Key": env.ALGOLIA_ADMIN_API_KEY,
          "X-Algolia-Application-Id": env.NEXT_PUBLIC_ALGOLIA_APP_ID,
        },
      })
    })

    // Disconnect from DB
    await step.run("disconnect-from-db", async () => {
      return prisma.$disconnect()
    })
  },
)

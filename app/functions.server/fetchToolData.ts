import { slugify } from "@curiousleaf/utils"
import { inngest } from "~/services.server/inngest"
import { prisma } from "~/services.server/prisma"
import { fetchRepository } from "~/utils/github"

export const fetchToolData = inngest.createFunction(
  { id: "fetch-tool-data" },
  { cron: "TZ=Europe/Warsaw 0 0 * * *" },
  async ({ step, logger }) => {
    const tools = await step.run("find-tools", async () => {
      return await prisma.tool.findMany({
        where: { publishedAt: { not: null } },
        select: { id: true, repository: true, bump: true },
      })
    })

    await Promise.all(
      tools.map(
        async tool =>
          await step.run(`update-tool-${tool.id}`, async () => {
            const repo = await fetchRepository(tool.id, tool.bump, tool.repository)

            if (repo) {
              const { stars, forks, license, lastCommitDate, score, topics, languages } = repo

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

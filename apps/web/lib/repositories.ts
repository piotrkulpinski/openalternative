import { slugify } from "@curiousleaf/utils"
import type { Prisma } from "@openalternative/db/client"
import { githubClient } from "~/services/github"

/**
 * Fetches the repository data for a tool and returns the data
 * in a format that can be used to update the tool.
 *
 * @param repository - The repository to fetch the data for.
 * @returns The repository data for the tool.
 */
export const getToolRepositoryData = async (repository: string) => {
  const repo = await githubClient.queryRepository(repository)
  const selfHostedTopics = ["selfhosted", "self-hosted"]

  if (!repo) return null

  return {
    stars: repo.stars,
    forks: repo.forks,
    score: repo.score,
    firstCommitDate: repo.createdAt,
    lastCommitDate: repo.pushedAt,
    isSelfHosted: repo.topics.some(topic => selfHostedTopics.includes(topic)) ? true : undefined,

    // License
    license: repo.license
      ? {
          connectOrCreate: {
            where: { name: repo.license },
            create: { name: repo.license, slug: slugify(repo.license).replace(/-0$/, "") },
          },
        }
      : undefined,

    // Topics
    topics: {
      connectOrCreate: repo.topics.map(slug => ({
        where: { slug: slugify(slug) },
        create: { slug: slugify(slug) },
      })),
    },
  } satisfies Prisma.ToolUpdateInput
}

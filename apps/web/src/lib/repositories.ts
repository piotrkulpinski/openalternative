import { slugify } from "@curiousleaf/utils"
import type { Prisma } from "@openalternative/db/client"
import { calculateHealthScore, getRepoOwnerAndName } from "@openalternative/github"
import { githubClient } from "~/services/github"

/**
 * Fetches the repository data for a tool and returns the data
 * in a format that can be used to update the tool.
 *
 * @param repository - The repository to fetch the data for.
 * @returns The repository data for the tool.
 */
export const fetchToolRepositoryData = async (repository: string) => {
  const repo = getRepoOwnerAndName(repository)
  const queryResult = await githubClient.queryRepository(repo)

  if (!queryResult) return null

  // Extract and transform the necessary metrics
  const metrics = {
    stars: queryResult.stargazerCount,
    forks: queryResult.forkCount,
    contributors: queryResult.mentionableUsers.totalCount,
    watchers: queryResult.watchers.totalCount,
    createdAt: queryResult.createdAt,
    pushedAt: queryResult.pushedAt,
  }

  const score = calculateHealthScore(metrics)
  const license =
    !queryResult.licenseInfo || queryResult.licenseInfo.spdxId === "NOASSERTION"
      ? null
      : queryResult.licenseInfo.spdxId

  // Prepare topics data
  const topics = queryResult.repositoryTopics.nodes.map(({ topic }) => ({
    slug: slugify(topic.name),
  }))

  // Return the extracted data
  return {
    stars: metrics.stars,
    forks: metrics.forks,
    pushedAt: metrics.pushedAt,
    createdAt: metrics.createdAt,
    score,
    license,
    topics,
  }
}

/**
 * Fetches the repository data for a tool and returns the data
 * in a format that can be used to update the tool.
 *
 * @param repository - The repository to fetch the data for.
 * @returns The repository data for the tool.
 */
export const getToolRepositoryData = async (repository: string) => {
  const repo = await fetchToolRepositoryData(repository)

  if (!repo) {
    return null
  }

  return {
    stars: repo.stars,
    forks: repo.forks,
    score: repo.score,
    firstCommitDate: repo.createdAt,
    lastCommitDate: repo.pushedAt,

    // License
    license: repo.license
      ? ({
          connectOrCreate: {
            where: { name: repo.license },
            create: {
              name: repo.license,
              slug: slugify(repo.license).replace(/-0$/, ""),
            },
          },
        } satisfies Prisma.ToolUpdateInput["license"])
      : undefined,

    // Topics
    topics: {
      connectOrCreate: repo.topics.map(({ slug }) => ({
        where: { slug },
        create: { slug },
      })),
    },
  } satisfies Prisma.ToolUpdateInput
}

import type { Prisma, Tool } from "@openalternative/db"
import type { Jsonify } from "inngest/helpers/jsonify"
import { firstCommitQuery, githubClient, repositoryQuery } from "~/services/github"
import type { FirstCommitQueryResult, RepositoryQueryResult } from "~/types/github"
import { DAY_IN_MS } from "~/utils/constants"
import { getSlug } from "~/utils/helpers"

type Repository = {
  owner: string
  name: string
}

/**
 * Extracts the repository owner and name from a GitHub URL.
 *
 * @param url The GitHub URL from which to extract the owner and name.
 * @returns An object containing the repository owner and name, or null if the URL is invalid.
 */
export const getRepoOwnerAndName = (url: string | null): Repository | null => {
  const regex = /github\.com\/(?<owner>[^/]+)\/(?<name>[^/]+)(\/|$)/
  const match = url?.match(regex)

  if (match?.groups?.name) {
    return match.groups as Repository
  }

  return null
}

type GetToolScoreProps = {
  stars: number
  forks: number
  contributors: number
  watchers: number
  lastCommitDate: Date | null
  firstCommitDate: Date
}

/**
 * Calculates a score for a tool based on its GitHub statistics.
 *
 * @param stars - The number of stars the tool has on GitHub.
 * @param forks - The number of forks the tool has on GitHub.
 * @param contributors - The number of contributors to the tool's repository.
 * @param watchers - The number of watchers the tool has on GitHub.
 * @param firstCommitDate - The date of the first commit to the tool's repository.
 * @param lastCommitDate - The date of the last commit to the tool's repository.
 * @param createdAt - The date the repository was created.
 * @returns The calculated score for the tool.
 */
const calculateHealthScore = ({
  stars,
  forks,
  contributors,
  watchers,
  firstCommitDate,
  lastCommitDate,
}: GetToolScoreProps) => {
  const timeSinceLastCommit = Date.now() - (lastCommitDate?.getTime() || 0)
  const daysSinceLastCommit = timeSinceLastCommit / DAY_IN_MS
  const lastCommitPenalty = Math.min(daysSinceLastCommit, 90) * 0.5

  // Calculate repository age in years using firstCommitDate
  const ageInYears = (Date.now() - firstCommitDate.getTime()) / (DAY_IN_MS * 365.25)

  // This factor will be between 0.5 (for very old repos) and 1 (for new repos)
  const ageFactor = 0.5 + 0.5 / (1 + ageInYears / 5)

  const starsScore = stars * 0.25 * ageFactor
  const forksScore = forks * 0.25 * ageFactor
  const watchersScore = watchers * 0.25 * ageFactor
  const contributorsScore = contributors * 0.5 * ageFactor

  return Math.round(starsScore + forksScore + contributorsScore + watchersScore - lastCommitPenalty)
}

const queryRepository = async (repo: Repository) => {
  try {
    const response = await githubClient<RepositoryQueryResult>(repositoryQuery, repo)

    if (!response?.repository) {
      return null
    }

    return response.repository
  } catch (error) {
    console.error(`Failed to fetch repository ${repo.name}: ${error}`)
  }
}

const queryFirstCommit = async (repo: Repository, after: string) => {
  try {
    const response = await githubClient<FirstCommitQueryResult>(firstCommitQuery, {
      ...repo,
      after,
    })

    return response.repository.defaultBranchRef.target.history.nodes[0]?.committedDate
  } catch {}
}

export const fetchToolRepositoryData = async (tool: Tool | Jsonify<Tool>) => {
  const repo = getRepoOwnerAndName(tool.repository)
  let firstCommitDate = null

  if (!repo) return null

  const queryResult = await queryRepository(repo)

  if (!queryResult) return null

  const {
    stargazerCount,
    forkCount,
    mentionableUsers,
    watchers,
    licenseInfo,
    repositoryTopics,
    languages: repositoryLanguages,
    defaultBranchRef,
  } = queryResult

  const lastCommit = defaultBranchRef.target.history

  if (tool.firstCommitDate) {
    firstCommitDate = new Date(tool.firstCommitDate)
  } else {
    const totalCommits = lastCommit.totalCount
    const startCursor = lastCommit.pageInfo.startCursor
    const after = startCursor.replace(/\b0+\b/g, (totalCommits - 2).toString())
    firstCommitDate = new Date((await queryFirstCommit(repo, after)) || "1970-01-01")
  }

  const lastCommitDate = new Date(lastCommit.nodes[0]?.committedDate || "1970-01-01")

  // Extract and transform the necessary metrics
  const metrics = {
    stars: stargazerCount,
    forks: forkCount,
    contributors: mentionableUsers.totalCount,
    watchers: watchers.totalCount,
    firstCommitDate,
    lastCommitDate,
  }

  const score = calculateHealthScore(metrics)
  const stars = metrics.stars
  const forks = metrics.forks
  const license = !licenseInfo || licenseInfo.spdxId === "NOASSERTION" ? null : licenseInfo.spdxId

  // Prepare topics data
  const topics = repositoryTopics.nodes.map(({ topic }) => ({
    slug: getSlug(topic.name),
  }))

  // Prepare languages data
  const languages = repositoryLanguages.edges
    .map(({ size, node }) => ({
      percentage: Math.round((size / repositoryLanguages.totalSize) * 100),
      name: node.name,
      slug: getSlug(node.name),
      color: node.color,
    }))
    .filter(({ percentage }) => percentage > 17.5)

  // Return the extracted data
  return {
    stars,
    forks,
    firstCommitDate,
    lastCommitDate,
    score,
    license,
    topics,
    languages,
  }
}

/**
 * Fetches the repository data for a tool and returns the data
 * in a format that can be used to update the tool.
 *
 * @param tool - The tool to fetch the repository data for.
 * @returns The repository data for the tool.
 */
export const getToolRepositoryData = async (tool: Tool | Jsonify<Tool>) => {
  const repo = await fetchToolRepositoryData(tool)

  if (!repo) {
    return null
  }

  const { stars, forks, firstCommitDate, lastCommitDate, score, license, topics, languages } = repo

  return {
    stars,
    forks,
    score,
    firstCommitDate,
    lastCommitDate,

    // License
    license: license
      ? ({
          connectOrCreate: {
            where: { name: license },
            create: {
              name: license,
              slug: getSlug(license).replace(/-0$/, ""),
            },
          },
        } satisfies Prisma.ToolUpdateInput["license"])
      : undefined,

    // Topics
    topics: {
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
    },

    // Languages
    languages: {
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
    },
  } satisfies Prisma.ToolUpdateInput
}

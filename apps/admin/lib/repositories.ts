import type { Tool } from "@openalternative/db"
import type { Jsonify } from "inngest/helpers/jsonify"
import { githubClient, repositoryQuery } from "~/services/github"
import type { RepositoryQueryResult } from "~/types/github"
import { getSlug } from "~/utils/helpers"

/**
 * Extracts the repository owner and name from a GitHub URL.
 *
 * @param url The GitHub URL from which to extract the owner and name.
 * @returns An object containing the repository owner and name, or null if the URL is invalid.
 */
export const getRepoOwnerAndName = (url: string | null) => {
  const regex = /github\.com\/(?<owner>[^/]+)\/(?<name>[^/]+)(\/|$)/
  const match = url?.match(regex)

  if (match?.groups) {
    const { owner, name } = match.groups
    return { owner, name }
  }

  return null
}

type GetToolScoreProps = {
  stars: number
  forks: number
  contributors: number
  watchers: number
  lastCommitDate: Date | null
  bump?: number | null
}

/**
 * Calculates a score for a tool based on its GitHub statistics and an optional bump.
 *
 * @param stars - The number of stars the tool has on GitHub.
 * @param forks - The number of forks the tool has on GitHub.
 * @param contributors - The number of contributors to the tool's repository.
 * @param watchers - The number of watchers the tool has on GitHub.
 * @param lastCommitDate - The date of the last commit to the tool's repository.
 * @param bump - An optional bump to the final score.
 * @returns The calculated score for the tool.
 */
export const calculateHealthScore = ({
  stars,
  forks,
  contributors,
  watchers,
  lastCommitDate,
  bump,
}: GetToolScoreProps) => {
  const timeSinceLastCommit = Date.now() - (lastCommitDate?.getTime() || 0)
  const daysSinceLastCommit = timeSinceLastCommit / (1000 * 60 * 60 * 24)
  // Negative score for evey day without commit up to 90 days
  const lastCommitPenalty = Math.min(daysSinceLastCommit, 90) * 0.5

  const starsScore = stars * 0.25
  const forksScore = forks * 0.5
  const contributorsScore = contributors * 0.5
  const watchersScore = watchers * 0.25

  return Math.round(
    starsScore + forksScore + contributorsScore + watchersScore - lastCommitPenalty + (bump || 0),
  )
}

export const fetchRepository = async (url: string, bump?: number | null) => {
  const repo = getRepoOwnerAndName(url)
  let queryResult: RepositoryQueryResult | null = null

  if (!repo) {
    return null
  }

  try {
    queryResult = await githubClient(repositoryQuery, repo)
  } catch (error) {
    console.error(`Failed to fetch repository ${url}: ${error}`)
  }

  // if the repository check fails, set the tool as draft
  if (!queryResult?.repository) {
    return null
  }

  const {
    stargazerCount,
    forkCount,
    mentionableUsers,
    watchers,
    defaultBranchRef,
    licenseInfo,
    repositoryTopics,
    languages: repositoryLanguages,
  } = queryResult.repository

  // Extract and transform the necessary metrics
  const metrics = {
    stars: stargazerCount,
    forks: forkCount,
    contributors: mentionableUsers.totalCount,
    watchers: watchers.totalCount,
    lastCommitDate: new Date(
      defaultBranchRef.target.history.edges[0]?.node.committedDate || new Date(),
    ),
    bump,
  }

  const score = calculateHealthScore(metrics)
  const stars = metrics.stars
  const forks = metrics.forks
  const license = !licenseInfo || licenseInfo.spdxId === "NOASSERTION" ? null : licenseInfo.spdxId
  const lastCommitDate = metrics.lastCommitDate

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
  return { stars, forks, lastCommitDate, score, license, topics, languages }
}

/**
 * Fetches the repository data for a tool and returns the data
 * in a format that can be used to update the tool.
 *
 * @param tool - The tool to fetch the repository data for.
 * @returns The repository data for the tool.
 */
export const fetchRepositoryData = async (tool: Tool | Jsonify<Tool>) => {
  const repo = await fetchRepository(tool.repository, tool.bump)

  if (!repo) {
    return null
  }

  const { stars, forks, lastCommitDate, score, license, topics, languages } = repo

  // License
  const licenseData = license
    ? {
        connectOrCreate: {
          where: { name: license },
          create: {
            name: license,
            slug: getSlug(license).replace(/-0$/, ""),
          },
        },
      }
    : undefined

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

  return {
    stars,
    forks,
    lastCommitDate,
    score,
    license: licenseData,
    topics: topicData,
    languages: languageData,
  }
}

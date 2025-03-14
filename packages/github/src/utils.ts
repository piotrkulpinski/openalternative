import { differenceInDays, differenceInYears } from "date-fns"
import type { Repository, RepositoryData, RepositoryQueryResult } from "./types"

export const githubRegex =
  /^(?:https?:\/\/)?github\.com\/(?<owner>[^/]+)\/(?<name>[a-zA-Z0-9._-]+?)(?:[/?#]|$)/

/**
 * Extracts the repository owner and name from a GitHub URL.
 *
 * @param url The GitHub URL from which to extract the owner and name.
 * @returns An object containing the repository owner and name, or null if the URL is invalid.
 */
export const getRepository = (url: string): Repository => {
  const match = url.toLowerCase().match(githubRegex)

  return match?.groups as Repository
}

/**
 * Returns the repository owner and name as a string.
 *
 * @param url The GitHub URL from which to extract the owner and name.
 * @returns The repository owner and name as a string.
 */
export const getRepositoryString = (url: string) => {
  const { owner, name } = getRepository(url)

  return `${owner}/${name}`
}

type GetToolScoreProps = {
  stars: number
  forks: number
  contributors: number
  watchers: number
  createdAt: Date
  pushedAt: Date
}

/**
 * Calculates a score for a tool based on its GitHub statistics.
 *
 * @param stars - The number of stars the tool has on GitHub.
 * @param forks - The number of forks the tool has on GitHub.
 * @param contributors - The number of contributors to the tool's repository.
 * @param watchers - The number of watchers the tool has on GitHub.
 * @param createdAt - The date the repository was created.
 * @param pushedAt - The date the repository was last pushed to.
 * @returns The calculated score for the tool.
 */
export const calculateHealthScore = ({
  stars,
  forks,
  contributors,
  watchers,
  createdAt,
  pushedAt,
}: GetToolScoreProps) => {
  const daysSinceLastCommit = pushedAt ? differenceInDays(new Date(), pushedAt) : 0
  const lastCommitPenalty = Math.min(daysSinceLastCommit, 90) * 0.5

  // Calculate repository age in years
  const ageInYears = differenceInYears(new Date(), createdAt)

  // This factor will be between 0.5 (for very old repos) and 1 (for new repos)
  const ageFactor = 0.5 + 0.5 / (1 + ageInYears / 5)

  const starsScore = stars * 0.25 * ageFactor
  const forksScore = forks * 0.25 * ageFactor
  const watchersScore = watchers * 0.25 * ageFactor
  const contributorsScore = contributors * 0.5 * ageFactor

  return Math.round(starsScore + forksScore + contributorsScore + watchersScore - lastCommitPenalty)
}

/**
 * Prepares the repository data for a tool and returns the data
 * in a format that can be used to update the tool.
 *
 * @param repository - The repository to prepare the data for.
 * @returns The prepared repository data for the tool.
 */
export const prepareRepositoryData = async (
  repository: RepositoryQueryResult,
): Promise<RepositoryData> => {
  const metrics = {
    stars: repository.stargazerCount,
    forks: repository.forkCount,
    contributors: repository.mentionableUsers.totalCount,
    watchers: repository.watchers.totalCount,
    createdAt: repository.createdAt,
    pushedAt: repository.pushedAt,
  }

  const score = calculateHealthScore(metrics)
  const license =
    !repository.licenseInfo || repository.licenseInfo.spdxId === "NOASSERTION"
      ? null
      : repository.licenseInfo.spdxId

  // Prepare topics data
  const topics = repository.repositoryTopics.nodes.map(node => node.topic.name)

  // Return the extracted data
  return {
    name: repository.name.toLowerCase(),
    nameWithOwner: repository.nameWithOwner.toLowerCase(),
    description: repository.description,
    url: repository.url,
    homepageUrl: repository.homepageUrl,
    stars: metrics.stars,
    forks: metrics.forks,
    contributors: metrics.contributors,
    watchers: metrics.watchers,
    pushedAt: metrics.pushedAt,
    createdAt: metrics.createdAt,
    score,
    license,
    topics,
  }
}

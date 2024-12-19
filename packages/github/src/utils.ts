import { differenceInDays, differenceInYears } from "date-fns"
import type { Repository } from "./types"

/**
 * Extracts the repository owner and name from a GitHub URL.
 *
 * @param url The GitHub URL from which to extract the owner and name.
 * @returns An object containing the repository owner and name, or null if the URL is invalid.
 */
export const getRepoOwnerAndName = (url: string | null): Repository | null => {
  if (!url) return null

  const match = url.match(
    /^(?:(?:https?:\/\/)?github\.com\/)?(?<owner>[^/]+)\/(?<name>[^/]+?)(?:\/|$)/,
  )

  return match?.groups as Repository | null
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

export const addSearchParamsToUrl = (url: string, params: { [key: string]: string }) => {
  // Create a URL object
  const urlObj = new URL(url)

  // Retrieve existing search parameters or create new if none exist
  const searchParams = new URLSearchParams(urlObj.search)

  // Add new search parameters to the existing ones
  for (const [key, value] of Object.entries(params)) {
    searchParams.set(key, value)
  }

  // Set the search parameters for the URL
  urlObj.search = searchParams.toString()

  // Return the resulting URL with the updated search parameters
  return urlObj.toString()
}

type GetToolScoreProps = {
  stars: number
  forks: number
  lastCommitDate: Date | null
  bump?: number | null
}

/**
 * Calculates a score for a tool based on its GitHub statistics and an optional bump.
 *
 * @param props.stars - The number of stars the tool has on GitHub.
 * @param props.forks - The number of forks the tool has on GitHub.
 * @param props.lastCommitDate - The date of the last commit to the tool's repository.
 * @param props.bump - An optional bump to the final score.
 * @returns The calculated score for the tool.
 */
export const getToolScore = ({ stars, forks, lastCommitDate, bump = 0 }: GetToolScoreProps) => {
  const timeSinceLastCommit = Date.now() - (lastCommitDate?.getTime() || 0)
  const daysSinceLastCommit = timeSinceLastCommit / (1000 * 60 * 60 * 24)

  const starsScore = stars * 0.25
  const forksScore = forks * 0.75
  const lastCommitPenalty = daysSinceLastCommit * 0.5

  return Math.round(starsScore + forksScore - lastCommitPenalty + bump)
}

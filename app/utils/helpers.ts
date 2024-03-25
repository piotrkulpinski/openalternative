/**
 * Updates the URL with the specified search parameters.
 *
 * @param url The original URL to be updated.
 * @param params An object containing key-value pairs to be set as search parameters.
 * @returns The updated URL with the new search parameters.
 */
export const updateUrlWithSearchParams = (
  url: string,
  params: { [key: string]: string }
): string => {
  // Create a URL object
  const urlObj = new URL(url)

  // Extract the search string, update it with new parameters, and get the updated search string
  const updatedSearchString = updateQueryString(urlObj.search, params)

  // Set the search parameters for the URL
  urlObj.search = updatedSearchString

  // Return the resulting URL with the updated search parameters
  return urlObj.toString()
}

/**
 * Updates a query string with the specified parameters.
 *
 * @param queryString The original query string to be updated.
 * @param params An object containing key-value pairs to be set as search parameters.
 * @returns The updated query string with the new search parameters.
 */
export const updateQueryString = (
  queryString: string,
  params: { [key: string]: string }
): string => {
  // Create a URLSearchParams object from the query string
  const searchParams = new URLSearchParams(queryString)

  // Add/remove search parameters based on the provided value
  for (const [key, value] of Object.entries(params)) {
    if (!value) {
      searchParams.delete(key)
    } else {
      searchParams.set(key, value)
    }
  }

  // Return the updated search string
  return searchParams.toString()
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
export const getToolScore = ({ stars, forks, lastCommitDate, bump }: GetToolScoreProps) => {
  const timeSinceLastCommit = Date.now() - (lastCommitDate?.getTime() || 0)
  const daysSinceLastCommit = timeSinceLastCommit / (1000 * 60 * 60 * 24)

  const starsScore = stars * 0.25
  const forksScore = forks * 0.75
  const lastCommitPenalty = daysSinceLastCommit * 0.5

  return Math.round(starsScore + forksScore - lastCommitPenalty + (bump || 0))
}

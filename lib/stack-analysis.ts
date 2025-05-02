import { analyzerApi } from "~/lib/apis"
import { getRepositoryString } from "~/lib/github/utils"

/**
 * Analyze the stack of a repository by its URL
 * @param url - The repository URL
 * @returns The analysis
 */
export const analyzeRepositoryStack = async (url: string) => {
  const repository = getRepositoryString(url)

  // Get analysis
  return await analyzerApi.url("/analyze").post({ repository })
}

import { graphql } from "@octokit/graphql"
import { repositoryQuery } from "./queries"
import type { RepositoryData, RepositoryQueryResult } from "./types"
import { getRepository, prepareRepositoryData } from "./utils"

export const createGithubClient = (token: string) => {
  const client = graphql.defaults({
    headers: { authorization: `token ${token}` },
  })

  return {
    async queryRepository(repository: string): Promise<RepositoryData | null> {
      const repo = getRepository(repository)

      try {
        const { repository } = await client<{ repository: RepositoryQueryResult }>(
          repositoryQuery,
          repo,
        )

        return prepareRepositoryData(repository)
      } catch (error) {
        console.error(`Failed to fetch repository ${repo.name}:`, error)
        return null
      }
    },
  }
}

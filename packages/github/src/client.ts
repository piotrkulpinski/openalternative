import { graphql } from "@octokit/graphql"
import { repositoryQuery } from "./queries"
import type { Repository, RepositoryQueryResult } from "./types"

export const createGithubClient = (token: string) => {
  const client = graphql.defaults({
    headers: { authorization: `token ${token}` },
  })

  return {
    async queryRepository(repo: Repository | null) {
      if (!repo) return null

      try {
        const response = await client<RepositoryQueryResult>(repositoryQuery, repo)

        if (!response?.repository) {
          return null
        }

        return response.repository
      } catch (error) {
        console.error(`Failed to fetch repository ${repo.name}:`, error)
        return null
      }
    },
  }
}

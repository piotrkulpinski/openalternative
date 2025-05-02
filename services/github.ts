import { graphql } from "@octokit/graphql"
import { env } from "~/env"
import { repositoryQuery } from "~/lib/github/queries"
import type { RepositoryData, RepositoryQueryResult } from "~/lib/github/types"
import { getRepository, prepareRepositoryData } from "~/lib/github/utils"

const client = graphql.defaults({
  headers: { authorization: `token ${env.GITHUB_TOKEN}` },
})

export const githubClient = {
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

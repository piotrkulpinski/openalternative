import { graphql } from "@octokit/graphql"
import { ActionFunctionArgs, json } from "@remix-run/node"
import { z } from "zod"
import { JSON_HEADERS } from "~/utils/constants"
import { RepositoryStarsQueryResult, repositoryStarsQuery } from "~/utils/github"

export const action = async ({ request }: ActionFunctionArgs) => {
  const schema = z.object({
    owner: z.string(),
    name: z.string(),
  })

  const payload = await request.json()
  const { owner, name } = schema.parse(payload)

  try {
    const { repository } = await graphql<RepositoryStarsQueryResult>({
      query: repositoryStarsQuery,
      owner,
      name,
      headers: { authorization: `token ${process.env.GITHUB_TOKEN}` },
    })

    return json(repository.stargazerCount, JSON_HEADERS)
  } catch (error) {
    console.error(`Failed to fetch repository stars ${owner}/${name}`, error)
    throw new Error(`Failed to fetch repository stars ${owner}/${name}`)
  }
}

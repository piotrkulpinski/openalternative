import { splitArrayChunks, titleCase } from "@curiousleaf/utils"
import { graphql } from "@octokit/graphql"
import Airtable from "airtable"
import { Repository, RepositoryData } from "./types"
import { getGithubQuery } from "./utils/github"

export type Env = {
  // Learn more at https://developers.cloudflare.com/workers/configuration/environment-variables/
  CLOUDFLARE_DEPLOY_HOOK_URL: string
  GITHUB_TOKEN: string
  AIRTABLE_TOKEN: string
  AIRTABLE_BASE_ID: string
  AIRTABLE_TABLE_ID: string
}

export default {
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    try {
      const repos: Repository[] = []
      const airtable = new Airtable({ apiKey: env.AIRTABLE_TOKEN })
      const table = airtable.base(env.AIRTABLE_BASE_ID)(env.AIRTABLE_TABLE_ID)

      // Fetch all records/repos
      await table
        .select({
          fields: ["Repository"],
          filterByFormula: "{Is Draft} = FALSE()",
          pageSize: 50,
        })
        .eachPage((records, fetchNextPage) => {
          for (const record of records) {
            repos.push({
              id: record.id,
              repository: record.get("Repository") as string | undefined,
            })
          }

          // Fetch the next page
          fetchNextPage()
        })
        .catch(err => console.error(err))

      // Fetch data from GitHub
      const result: Record<string, RepositoryData> = await graphql(getGithubQuery(repos), {
        headers: { authorization: `token ${env.GITHUB_TOKEN}` },
      })

      // Map the result to the Airtable records
      const records = Object.entries(result).map(([id, data]) => ({
        id,
        fields: {
          Forks: data.forkCount,
          Stars: data.stargazerCount,
          Issues: data.issues.totalCount,
          License: data.licenseInfo.spdxId === "NOASSERTION" ? undefined : data.licenseInfo.spdxId,
          CommitDate: data.defaultBranchRef.target.history.nodes[0].committedDate,
          Topic: data.repositoryTopics.nodes.map(node => titleCase(node.topic.name)),
          Language: data.languages.nodes.map(node => node.name),
        },
      }))

      // Chunk the array into batches of 10.
      const recordChunks = splitArrayChunks(records, 10)

      // Create an array of promises
      const promises = recordChunks.map(records => table.update(records, { typecast: true }))

      // Use Promise.all to perform the updates concurrently.
      await Promise.all(promises)

      // Trigger a Cloudflare deploy
      await fetch(env.CLOUDFLARE_DEPLOY_HOOK_URL, { method: "POST" })
    } catch (error) {
      // Handle any errors that occurred during the execution.
      console.error("An error occurred:", error)
    }
  },
}

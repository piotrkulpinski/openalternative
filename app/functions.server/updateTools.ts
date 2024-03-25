import { inngest } from "~/services.server/inngest"
import { prisma } from "~/services.server/prisma"
import { getRepoOwnerAndName } from "~/utils/github"
import { fetchGithubRepo } from "./fetch/fetchGithubRepo"

export const updateTools = inngest.createFunction(
  { id: "update-tools" },
  // Execute the function every 8 hours
  { cron: "0 0,8,16 * * *" },

  async ({ step, logger }) => {
    // Fetch the tools
    const tools = await step.run("find-tools", async () => {
      return await prisma.tool.findMany({
        select: { id: true, repository: true },
      })
    })

    // Log the number of repositories fetched
    logger.info(`Started fetching ${tools.length} repositories`)

    // Trigger a new event for each repository
    await Promise.all(
      tools.map(async ({ id, repository }) => {
        const repo = getRepoOwnerAndName(repository)

        if (repo) {
          return step.invoke("fetch-github-repo", {
            function: fetchGithubRepo,
            data: { id, owner: repo.owner, name: repo.name },
          })
        }
      })
    )
  }
)

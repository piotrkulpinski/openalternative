import { LoaderFunctionArgs } from "@remix-run/node"
import { prisma } from "~/services.server/prisma"
import { getRepoOwnerAndName } from "~/utils/github"
import { got } from "got"
import { SITE_URL } from "~/utils/constants"

export const loader = async ({ request }: LoaderFunctionArgs) => {
  if (request.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 })
  }

  const tools = await prisma.tool.findMany({
    where: { isDraft: false },
    select: { id: true, repository: true, website: true, bump: true },
  })

  // Trigger a new event for each repository
  await Promise.all(
    tools.map(async ({ id, bump, repository }) => {
      const repo = getRepoOwnerAndName(repository)

      if (repo) {
        return got
          .post(`${SITE_URL}/api/fetch-repository`, {
            json: { id, bump, owner: repo.owner, name: repo.name },
            headers: { Authorization: `Bearer ${process.env.CRON_SECRET}` },
          })
          .json()
      }
    })
  )

  return new Response("OK", { status: 200 })
}

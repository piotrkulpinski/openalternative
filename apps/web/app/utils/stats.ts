import { graphql } from "@octokit/graphql"
import { prisma } from "apps/web/app/services.server/prisma"
import {
  type RepositoryStarsQueryResult,
  getRepoOwnerAndName,
  repositoryStarsQuery,
} from "apps/web/app/utils/github"
import { got } from "got"
import { GITHUB_URL } from "./constants"

// Get the number of tools
export const getToolCount = async () => {
  return await prisma.tool.count({
    where: { publishedAt: { lte: new Date() } },
  })
}

// Get the number of GitHub stars
export const getStarCount = async () => {
  const repo = getRepoOwnerAndName(GITHUB_URL)

  if (!repo) {
    throw new Error("Invalid GitHub URL")
  }

  const { repository } = await graphql<RepositoryStarsQueryResult>({
    query: repositoryStarsQuery,
    owner: repo.owner,
    name: repo.name,
    headers: { authorization: `token ${process.env.GITHUB_TOKEN}` },
  })

  return repository.stargazerCount
}

// Get the number of subscribers
export const getSubscriberCount = async () => {
  const subscribers = await got
    .get("https://connect.mailerlite.com/api/subscribers", {
      searchParams: { limit: 1000 },
      headers: { authorization: `Bearer ${process.env.MAILERLITE_API_TOKEN}` },
    })
    .json<{ data: unknown[] }>()

  return subscribers.data.length
}

import { promises as fs } from "fs"
import path from "path"
import { graphql } from "@octokit/graphql"
import { got } from "got"
import { prisma } from "~/services.server/prisma"
import { GITHUB_URL } from "./constants"
import {
  type RepositoryStarsQueryResult,
  getRepoOwnerAndName,
  repositoryStarsQuery,
} from "~/utils/github"

const dataFilePath = path.join(process.cwd(), "public", "stats.json")

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

// Write the stats to the JSON file
export const writeStats = async (stats: object) => {
  const object = { ...stats, lastUpdated: new Date().toISOString() }

  // Write data to the JSON file
  await fs.writeFile(dataFilePath, JSON.stringify(object, null, 2))
}

// Read the stats from the JSON file
export const readStats = async () => {
  if (!checkFileExists(dataFilePath)) {
    return null
  }

  const fileContents = await fs.readFile(dataFilePath, "utf8")
  return JSON.parse(fileContents)
}

// Check if a file exists
export const checkFileExists = async (file: string) => {
  return await fs
    .access(file, fs.constants.F_OK)
    .then(() => true)
    .catch(() => false)
}

import { graphql } from "@octokit/graphql"
import { DAY_IN_MS } from "./constants"
import { prisma } from "~/services.server/prisma"
import { slugify } from "inngest"

export type RepositoryQueryResult = {
  repository: {
    stargazerCount: number
    forkCount: number
    watchers: {
      totalCount: number
    }
    mentionableUsers: {
      totalCount: number
    }
    licenseInfo: {
      spdxId: string
    } | null
    defaultBranchRef: {
      target: {
        history: {
          edges: Array<{
            node: {
              committedDate: string
            }
          }>
        }
      }
    }
    repositoryTopics: {
      nodes: {
        topic: {
          name: string
        }
      }[]
    }
    languages: {
      totalSize: number
      edges: Array<{
        size: number
        node: {
          name: string
          color: string
        }
      }>
    }
  }
}

export type RepositoryStarsQueryResult = {
  repository: {
    stargazerCount: number
  }
}

export const repositoryQuery = `query RepositoryQuery($owner: String!, $name: String!) {
  repository(owner: $owner, name: $name) {
    stargazerCount
    forkCount
    watchers {
      totalCount
    }
    mentionableUsers {
      totalCount
    }
    licenseInfo {
      spdxId
    }
    defaultBranchRef {
      target {
        ... on Commit {
          history(first: 1) {
            edges {
              node {
                ... on Commit {
                  committedDate
                }
              }
            }
          }
        }
      }
    }
    repositoryTopics(first: 25) {
      nodes {
        topic {
          name
        }
      }
    }
    languages(first: 3, orderBy: { field: SIZE, direction: DESC}) {
      totalSize
      edges {
        size
        node {
          name
          color
        }
      }
    }
  }
}`

export const repositoryStarsQuery = `query RepositoryQuery($owner: String!, $name: String!) {
  repository(owner: $owner, name: $name) {
    stargazerCount
  }
}`

/**
 * Extracts the repository owner and name from a GitHub URL.
 *
 * @param url The GitHub URL from which to extract the owner and name.
 * @returns An object containing the repository owner and name, or null if the URL is invalid.
 */
export const getRepoOwnerAndName = (url: string | null) => {
  const regex = /github\.com\/(?<owner>[^/]+)\/(?<name>[^/]+)(\/|$)/
  const match = url?.match(regex)

  if (match?.groups) {
    const { owner, name } = match.groups
    return { owner, name }
  }

  return null
}

type GetToolScoreProps = {
  stars: number
  forks: number
  contributors: number
  watchers: number
  lastCommitDate: Date | null
  bump?: number | null
}

/**
 * Calculates a score for a tool based on its GitHub statistics and an optional bump.
 *
 * @param props.stars - The number of stars the tool has on GitHub.
 * @param props.forks - The number of forks the tool has on GitHub.
 * @param props.contributors - The number of contributors to the tool's repository.
 * @param props.watchers - The number of watchers the tool has on GitHub.
 * @param props.lastCommitDate - The date of the last commit to the tool's repository.
 * @param props.bump - An optional bump to the final score.
 * @returns The calculated score for the tool.
 */
export const calculateHealthScore = ({
  stars,
  forks,
  contributors,
  watchers,
  lastCommitDate,
  bump,
}: GetToolScoreProps) => {
  const timeSinceLastCommit = Date.now() - (lastCommitDate?.getTime() || 0)
  const daysSinceLastCommit = timeSinceLastCommit / DAY_IN_MS
  // Negative score for evey day without commit up to 90 days
  const lastCommitPenalty = Math.min(daysSinceLastCommit, 90) * 0.5

  const starsScore = stars * 0.25
  const forksScore = forks * 0.5
  const contributorsScore = contributors * 0.5
  const watchersScore = watchers * 0.25

  return Math.round(
    starsScore + forksScore + contributorsScore + watchersScore - lastCommitPenalty + (bump || 0),
  )
}

export const fetchRepository = async (id: string, bump: number | null, repository: string) => {
  const repo = getRepoOwnerAndName(repository)
  let queryResult: RepositoryQueryResult | null = null

  if (!repo) {
    return null
  }

  try {
    queryResult = await graphql({
      query: repositoryQuery,
      owner: repo.owner,
      name: repo.name,
      headers: { authorization: `token ${process.env.GITHUB_TOKEN}` },
    })
  } catch (error) {
    console.error(`Failed to fetch repository ${repository}: ${error}`)
  }

  // if the repository check fails, set the tool as draft
  if (!queryResult?.repository) {
    await prisma.tool.update({
      where: { id },
      data: { publishedAt: null },
    })

    return null
  }

  const {
    stargazerCount,
    forkCount,
    mentionableUsers,
    watchers,
    defaultBranchRef,
    licenseInfo,
    repositoryTopics,
    languages: repositoryLanguages,
  } = queryResult.repository

  // Extract and transform the necessary metrics
  const metrics = {
    stars: stargazerCount,
    forks: forkCount,
    contributors: mentionableUsers.totalCount,
    watchers: watchers.totalCount,
    lastCommitDate: new Date(defaultBranchRef.target.history.edges[0].node.committedDate),
    bump,
  }

  const score = calculateHealthScore(metrics)
  const stars = metrics.stars
  const forks = metrics.forks
  const license = !licenseInfo || licenseInfo.spdxId === "NOASSERTION" ? null : licenseInfo.spdxId
  const lastCommitDate = metrics.lastCommitDate

  // Prepare topics data
  const topics = repositoryTopics.nodes.map(({ topic }) => ({
    slug: slugify(topic.name),
  }))

  // Prepare languages data
  const languages = repositoryLanguages.edges
    .map(({ size, node }) => ({
      percentage: Math.round((size / repositoryLanguages.totalSize) * 100),
      name: node.name,
      slug: slugify(node.name),
      color: node.color,
    }))
    .filter(({ percentage }) => percentage > 17.5)

  // Return the extracted data
  return { stars, forks, license, lastCommitDate, score, topics, languages }
}

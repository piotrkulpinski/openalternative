import { got } from "got"
import { add, differenceInDays, format, isAfter, parseISO } from "date-fns"
import { DAY_IN_MS } from "./constants"

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
    }
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

export const getRepoStargazers = async (owner: string, name: string, page?: number) => {
  let url = `https://api.github.com/repos/${owner}/${name}/stargazers?per_page=${100}`

  if (page !== undefined) {
    url = `${url}&page=${page}`
  }

  return got
    .get(url, {
      headers: {
        Accept: "application/vnd.github.v3.star+json",
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
      },
    })
    .json<{ starred_at: string }[]>()
}

export const getRepoStargazersCount = async (owner: string, name: string) => {
  const { stargazers_count } = await got
    .get(`https://api.github.com/repos/${owner}/${name}`, {
      headers: {
        Accept: "application/vnd.github.v3.star+json",
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
      },
    })
    .json<{ stargazers_count: number }>()

  return stargazers_count
}

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
 * @param stars - The number of stars the tool has on GitHub.
 * @param forks - The number of forks the tool has on GitHub.
 * @param contributors - The number of contributors to the tool's repository.
 * @param watchers - The number of watchers the tool has on GitHub.
 * @param lastCommitDate - The date of the last commit to the tool's repository.
 * @param bump - An optional bump to the final score.
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

export const getAllGithubStars = async (owner: string, name: string, amount = 20) => {
  // Get the total amount of stars from GitHub
  const totalStars = await getRepoStargazersCount(owner, name)

  console.log(totalStars)

  // get total pages
  const totalPages = Math.ceil(totalStars / 100)

  // How many pages to skip? We don't want to spam requests
  const pageSkips = totalPages < amount ? amount : Math.ceil(totalPages / amount)

  // Send all the requests at the same time
  const starsDates = (
    await Promise.all(
      [...new Array(amount)].map(async (_, index) => {
        const page = index * pageSkips || 1
        return getRepoStargazers(owner, name, page)
      }),
    )
  )
    .flatMap(p => p)
    .reduce((acc: any, stars) => {
      const yearMonth = stars.starred_at.split("T")[0]
      acc[yearMonth] = (acc[yearMonth] || 0) + 1
      return acc
    }, {})

  console.log(starsDates)

  // how many stars did we find from a total of `requestAmount` requests?
  const foundStars = Object.keys(starsDates).reduce((all, current) => all + starsDates[current], 0)

  // Find the earliest date
  const lowestMonthYear = Object.keys(starsDates).reduce((lowest, current) => {
    const currentDate = parseISO(current.split("T")[0])
    if (isAfter(currentDate, lowest)) {
      return currentDate
    }
    return lowest
  }, parseISO(new Date().toISOString()))

  // Count dates until today
  const splitDate = differenceInDays(new Date(), lowestMonthYear) + 1

  // Create an array with the amount of stars we didn't find
  const array = [...new Array(totalStars - foundStars)]

  // Set the amount of value to add proportionally for each day
  const splitStars: any[][] = []
  for (let i = splitDate; i > 0; i--) {
    splitStars.push(array.splice(0, Math.ceil(array.length / i)))
  }

  // Calculate the amount of stars for each day
  return [...new Array(splitDate)].map((_, index, arr) => {
    const yearMonthDay = format(add(lowestMonthYear, { days: index }), "yyyy-MM-dd")
    const value = starsDates[yearMonthDay] || 0
    return {
      stars: value + splitStars[index].length,
      date: {
        month: +format(add(lowestMonthYear, { days: index }), "M"),
        year: +format(add(lowestMonthYear, { days: index }), "yyyy"),
        day: +format(add(lowestMonthYear, { days: index }), "d"),
      },
    }
  })
}

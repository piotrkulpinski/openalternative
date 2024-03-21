import { graphql } from "@octokit/graphql"
import { json } from "@remix-run/node"
import { prisma } from "~/services.server/prisma"
import { getToolScore } from "~/utils/helpers"

type RepositoryData = {
  forkCount: number
  stargazerCount: number
  licenseInfo: {
    spdxId: string
  }
  defaultBranchRef: {
    target: {
      history: {
        nodes: {
          committedDate: string
        }[]
      }
    }
  }
  // repositoryTopics: {
  //   nodes: {
  //     topic: {
  //       name: string
  //     }
  //   }[]
  // }
  // languages: {
  //   nodes: {
  //     name: string
  //     color: string
  //   }[]
  // }
}

const getRepoOwnerAndName = (url: string | null) => {
  const regex = /github\.com\/(?<owner>[^/]+)\/(?<name>[^/]+)(\/|$)/
  const match = url?.match(regex)

  if (match?.groups) {
    const { owner, name } = match.groups
    return { owner, name }
  }

  return null
}

export async function action() {
  try {
    const headers = { authorization: `token ${process.env.GITHUB_TOKEN}` }

    const tools = await prisma.tool.findMany({
      select: { id: true, repository: true, bump: true },
    })

    const repos = tools
      // Filter out repos that are not from GitHub
      .filter(({ repository }) => repository?.includes("github"))
      // Extract owner and name from the URL
      .map(({ id, repository }) => ({ id, ...getRepoOwnerAndName(repository) }))

    const repoQuery = repos
      .map(
        ({ id, owner, name }) => `repo${id}: repository(owner: "${owner}", name: "${name}") {
    ...repoProperties
    }`
      )
      .join("\n")

    const query = `
      fragment repoProperties on Repository {
        forkCount
        stargazerCount
        licenseInfo {
          spdxId
        }
        defaultBranchRef {
          target {
            ... on Commit {
              history(first: 1) {
                nodes {
                  committedDate
                }
              }
            }
          }
        }
      }

      {
      ${repoQuery}
    }`

    // repositoryTopics(first: 25) {
    //   nodes {
    //     topic {
    //       name
    //     }
    //   }
    // }
    // languages(first: 2, orderBy: { field: SIZE, direction: DESC}) {
    //   nodes {
    //     name
    //     color
    //   }
    // }

    // Fetch data from GitHub
    const result: Record<string, RepositoryData> = await graphql({ query, headers }).catch(
      (error) => console.error(error)
    )

    // Use Promise.all to perform the updates concurrently.
    await Promise.all(
      Object.entries(result).map(
        ([repoId, { stargazerCount, forkCount, licenseInfo, defaultBranchRef }]) => {
          const id = parseInt(repoId.replace("repo", ""))
          const tool = tools.find((tool) => tool.id === id)

          const stars = stargazerCount
          const forks = forkCount
          const license = licenseInfo.spdxId === "NOASSERTION" ? undefined : licenseInfo.spdxId
          const lastCommitDate = new Date(defaultBranchRef.target.history.nodes[0].committedDate)

          const score = getToolScore({
            stars,
            forks,
            lastCommitDate,
            bump: tool?.bump,
          })

          return prisma.tool.update({
            where: { id },
            data: { stars, forks, license, lastCommitDate, score },
          })
        }
      )
    )
  } catch (error) {
    console.error(error)
  }

  return json({ success: true })
}

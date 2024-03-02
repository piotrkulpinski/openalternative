import { Repository } from "../types"

const getRepoOwnerAndName = (url: string | undefined) => {
  const regex = /github\.com\/(?<owner>[^/]+)\/(?<name>[^/]+)(\/|$)/
  const match = url?.match(regex)

  if (match?.groups) {
    const { owner, name } = match.groups
    return { owner, name }
  }

  return null
}

export const getGithubQuery = (repos: Repository[]) => {
  const githubRepos = repos
    // Filter out repos that are not from GitHub
    .filter(({ repository }) => repository?.includes("github"))
    // Extract owner and name from the URL
    .map(({ id, repository }) => ({ id, ...getRepoOwnerAndName(repository) }))

  const query = `
    fragment repoProperties on Repository {
      forkCount
      stargazerCount
      issues(states: OPEN) {
        totalCount
      }
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
      repositoryTopics(first: 100) {
        nodes {
          topic {
            name
          }
        }
      }
      languages(first: 2, orderBy: { field: SIZE, direction: DESC}) {
        nodes {
          name
          color
        }
      }
    }

    {
    ${githubRepos
      .map(
        ({ id, owner, name }) => `${id}: repository(owner: "${owner}", name: "${name}") {
    ...repoProperties
    }`,
      )
      .join("\n")}
  }`

  return query
}

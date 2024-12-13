import { graphql } from "@octokit/graphql"
import { env } from "~/env"

export const githubClient = graphql.defaults({
  headers: { authorization: `token ${env.GITHUB_TOKEN}` },
})

export const repositoryQuery = `
  query($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      stargazerCount
      forkCount
      mentionableUsers {
        totalCount
      }
      watchers {
        totalCount
      }
      licenseInfo {
        spdxId
      }
      repositoryTopics(first: 10) {
        nodes {
          topic {
            name
          }
        }
      }
      languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
        totalSize
        edges {
          size
          node {
            name
            color
          }
        }
      }
      defaultBranchRef {
        target {
          ... on Commit {
            history(first: 1) {
              totalCount
              pageInfo {
                startCursor
                endCursor
              }
              nodes {
                committedDate
              }
            }
          }
        }
      }
    }
  }
`

export const repositoryStarsQuery = `
  query ($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      stargazerCount
    }
  }
`

export const firstCommitQuery = `
  query($owner: String!, $name: String!, $after: String!) {
    repository(owner: $owner, name: $name) {
      defaultBranchRef {
        target {
          ... on Commit {
            history(first: 1, after: $after) {
              nodes {
                committedDate
              }
            }
          }
        }
      }
    }
  }
`

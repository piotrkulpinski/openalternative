import { graphql } from "@octokit/graphql"
import { env } from "~/env"

export const githubClient = graphql.defaults({
  headers: { authorization: `token ${env.GITHUB_TOKEN}` },
})

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

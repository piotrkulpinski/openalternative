export const repositoryQuery = `
  query($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      name
      nameWithOwner
      description
      url
      homepageUrl
      createdAt
      updatedAt
      pushedAt
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
    }
  }
`

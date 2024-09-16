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

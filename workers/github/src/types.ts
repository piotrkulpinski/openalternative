export type Repository = {
  id: string
  repository?: string
}

export type RepositoryData = {
  forkCount: number
  stargazerCount: number
  issues: {
    totalCount: number
  }
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
  repositoryTopics: {
    nodes: {
      topic: {
        name: string
      }
    }[]
  }
  languages: {
    nodes: {
      name: string
      color: string
    }[]
  }
}

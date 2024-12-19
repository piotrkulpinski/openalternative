export type Repository = {
  owner: string
  name: string
}

export type RepositoryQueryResult = {
  repository: {
    name: string
    description?: string
    homepageUrl?: string
    createdAt: Date
    updatedAt: Date
    pushedAt: Date
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
    repositoryTopics: {
      nodes: Array<{
        topic: {
          name: string
        }
      }>
    }
  }
}

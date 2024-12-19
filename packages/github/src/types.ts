export type Repository = {
  owner: string
  name: string
}

export type RepositoryData = {
  name: string
  nameWithOwner: string
  description?: string
  url: string
  homepageUrl?: string
  stars: number
  forks: number
  contributors: number
  watchers: number
  pushedAt: Date
  createdAt: Date
  score: number
  license: string | null
  topics: string[]
}

export type RepositoryQueryResult = {
  name: string
  nameWithOwner: string
  description?: string
  url: string
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

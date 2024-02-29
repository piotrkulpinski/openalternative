import { gql } from "~/.graphql"
import type { GetToolsQuery } from "~/.graphql/graphql"

export const getToolsQuery = gql(`
  query GetTools($filter: JSON) {
    tools(_filter: $filter, public: true) {
      id
      name
      slug
      description
      website
      repository
      category {
        id
        name
        slug
      }
      alternative {
        id
        name
        slug
      }
    }
  }
`)

export type Tools = NonNullable<GetToolsQuery["tools"]>
export type Tool = NonNullable<Tools[number]>

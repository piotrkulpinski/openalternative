import { gql } from "~/.graphql"
import type { GetToolsQuery } from "~/.graphql/graphql"

export const getToolsQuery = gql(`
  query GetTools($filter: JSON, $orderBy: JSON) {
    tools(_filter: $filter, _order_by: $orderBy) {
      id
      name
      slug
      description
      website
      stars
      category {
        id
        name
        slug
      }
    }
  }
`)

export const getToolQuery = gql(`
  query GetTool($slug: String!) {
    tools(slug: $slug, isDraft: false) {
      id
      name
      slug
      description
      website
      repository
      forks
      stars
      issues
      license
      commitDate
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
      language {
        id
        name
        slug
      }
      topic {
        id
        name
        slug
      }
    }
  }
`)

export type Tools = NonNullable<GetToolsQuery["tools"]>
export type Tool = NonNullable<Tools[number]>

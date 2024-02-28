import { gql } from "~/.graphql"

export const getToolsQuery = gql(`
  query GetTools($filter: JSON) {
    tools(_filter: $filter, public: true) {
      id
      name
      slug
      description
      website
      category {
        id
        name
      }
    }
  }
`)

export const getToolsSlugsQuery = gql(`
  query GetToolsSlugs {
    tools {
      slug
    }
  }
`)

export const getToolQuery = gql(`
  query GetTool($slug: String!) {
    tools(slug: $slug) {
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

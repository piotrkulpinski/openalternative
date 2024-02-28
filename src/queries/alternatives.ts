import { gql } from "../.graphql"

export const getAlternativesQuery = gql(`
  query GetAlternatives {
    alternatives {
      id
      name
      slug
    }
  }
`)

export const getAlternativesSlugsQuery = gql(`
  query GetAlternativesSlugs {
    alternatives {
      slug
    }
  }
`)

export const getAlternativeQuery = gql(`
  query GetAlternative($slug: String!) {
    alternatives(slug: $slug) {
      id
      name
      description
      website
      tools {
        id
        name
        slug
        description
        website
        category {
          id
          name
          slug
        }
      }
    }
  }
`)

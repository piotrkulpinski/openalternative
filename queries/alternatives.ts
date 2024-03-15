import type { GetAlternativesQuery } from "~/.graphql/graphql"
import { gql } from "~/.graphql"

export const getAlternativesQuery = gql(`
  query GetAlternatives {
    alternatives(_order_by: "name") {
      id
      name
      slug
      description
      website
      tools {
        id
      }
    }
  }
`)

export const getAlternativeQuery = gql(`
  query GetAlternative($slug: String!) {
    alternatives(slug: $slug) {
      id
      name
      slug
      description
      website
      tools {
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
  }
`)

export type Alternatives = NonNullable<GetAlternativesQuery["alternatives"]>
export type Alternative = NonNullable<Alternatives[number]>

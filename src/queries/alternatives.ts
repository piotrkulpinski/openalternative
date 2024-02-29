import type { GetAlternativesQuery } from "~/.graphql/graphql"
import { gql } from "../.graphql"

export const getAlternativesQuery = gql(`
  query GetAlternatives {
    alternatives {
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
        repository
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

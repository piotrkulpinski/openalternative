import type { GetLanguagesQuery } from "~/.graphql/graphql"
import { gql } from "../.graphql"

export const getLanguagesQuery = gql(`
  query GetLanguages {
    languages {
      id
      name
      slug
      tools {
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
        favicon
        screenshot
        category {
          id
          name
          slug
        }
      }
    }
  }
`)

export type Languages = NonNullable<GetLanguagesQuery["languages"]>
export type Language = NonNullable<Languages[number]>

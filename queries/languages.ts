import type { GetLanguagesQuery } from "~/.graphql/graphql"
import { gql } from "../.graphql"

export const getLanguagesQuery = gql(`
  query GetLanguages {
    languages(_order_by: "name") {
      id
      name
      slug
      tools {
        id
      }
    }
  }
`)

export const getLanguageQuery = gql(`
  query GetLanguage($slug: String!) {
    languages(slug: $slug) {
      id
      name
      slug
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

export type Languages = NonNullable<GetLanguagesQuery["languages"]>
export type Language = NonNullable<Languages[number]>

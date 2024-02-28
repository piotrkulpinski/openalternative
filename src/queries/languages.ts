import { gql } from "../.graphql"

export const getLanguagesQuery = gql(`
  query GetLanguages {
    languages {
      id
      name
      slug
    }
  }
`)

export const getLanguagesSlugsQuery = gql(`
  query GetLanguagesSlugs {
    languages {
      slug
    }
  }
`)

export const getLanguageQuery = gql(`
  query GetLanguage($slug: String!) {
    languages(slug: $slug) {
      id
      name
      tools {
        id
        name
        slug
      }
    }
  }
`)

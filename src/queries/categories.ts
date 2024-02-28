import { gql } from "../.graphql"

export const getCategoriesQuery = gql(`
  query GetCategories {
    categories {
      id
      name
      slug
    }
  }
`)

export const getCategoriesSlugsQuery = gql(`
  query GetCategoriesSlugs {
    categories {
      slug
    }
  }
`)

export const getCategoryQuery = gql(`
  query GetCategory($slug: String!) {
    categories(slug: $slug) {
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

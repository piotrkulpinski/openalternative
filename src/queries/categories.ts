import type { GetCategoriesQuery } from "~/.graphql/graphql"
import { gql } from "../.graphql"

export const getCategoriesQuery = gql(`
  query GetCategories {
    categories {
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
        category {
          id
          name
          slug
        }
      }
    }
  }
`)

export type Categories = NonNullable<GetCategoriesQuery["categories"]>
export type Category = NonNullable<Categories[number]>

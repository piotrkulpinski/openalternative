import type { GetCategoriesQuery } from "~/.graphql/graphql"
import { gql } from "../.graphql"

export const getCategoriesQuery = gql(`
  query GetCategories {
    categories(_order_by: "name") {
      id
      name
      slug
      tools {
        id
      }
    }
  }
`)

export const getCategoryQuery = gql(`
  query GetCategory($slug: String!) {
    categories(slug: $slug) {
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

export type Categories = NonNullable<GetCategoriesQuery["categories"]>
export type Category = NonNullable<Categories[number]>

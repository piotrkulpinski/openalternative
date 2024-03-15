import type { GetTopicsQuery } from "~/.graphql/graphql"
import { gql } from "../.graphql"

export const getTopicsQuery = gql(`
  query GetTopics {
    topics(_order_by: "name") {
      id
      name
      slug
      tools {
        id
      }
    }
  }
`)

export const getTopicQuery = gql(`
  query GetTopic($slug: String!) {
    topics(slug: $slug) {
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

export type Topics = NonNullable<GetTopicsQuery["topics"]>
export type Topic = NonNullable<Topics[number]>

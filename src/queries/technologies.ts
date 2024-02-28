import { gql } from "../.graphql"

export const getTechnologiesQuery = gql(`
  query GetTechnologies {
    technologies {
      id
      name
      slug
    }
  }
`)

export const getTechnologiesSlugsQuery = gql(`
  query GetTechnologiesSlugs {
    technologies {
      slug
    }
  }
`)

export const getTechnologyQuery = gql(`
  query GetTechnology($slug: String!) {
    technologies(slug: $slug) {
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

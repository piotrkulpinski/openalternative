import { CodegenConfig } from "@graphql-codegen/cli"
import { env } from "./env"

const config: CodegenConfig = {
  documents: ["queries/**/*.{ts,tsx}"],
  schema: {
    [env.GRAPHQL_ENDPOINT]: {
      headers: {
        Authorization: `Bearer ${env.GRAPHQL_TOKEN}`,
      },
    },
  },
  generates: {
    "./.graphql/": {
      preset: "client",
      plugins: [],
      presetConfig: {
        gqlTagName: "gql",
      },
      config: {
        skipTypename: true,
        useTypeImports: true,
        avoidOptionals: true,
      },
    },
  },
  ignoreNoDocuments: true,
}

export default config

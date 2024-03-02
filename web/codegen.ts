import type { CodegenConfig } from "@graphql-codegen/cli"
import { env } from "./src/variables"

const config: CodegenConfig = {
  documents: ["./src/queries/**/*.{ts,tsx}"],
  schema: {
    [env.GRAPHQL_ENDPOINT]: {
      headers: {
        Authorization: `Bearer ${env.GRAPHQL_TOKEN}`,
      },
    },
  },
  generates: {
    "./src/.graphql/": {
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

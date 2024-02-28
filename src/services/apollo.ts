import { ApolloClient, InMemoryCache } from "@apollo/client/core"
import { HttpLink } from "@apollo/client/link/http"
import { env } from "~/variables"

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: env.GRAPHQL_ENDPOINT,
    headers: {
      authorization: `Bearer ${env.GRAPHQL_TOKEN}`,
    },
    // you can disable result caching here if you want to
    // (this does not work if you are rendering your page with `export const dynamic = "force-static"`)
    // fetchOptions: { cache: "no-store" },
  }),
})

import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client"
import { registerApolloClient } from "@apollo/experimental-nextjs-app-support/rsc"
import { env } from "~/env"

export const { getClient } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: env.GRAPHQL_ENDPOINT,
      headers: {
        // you can add your own headers here
        authorization: `Bearer ${env.GRAPHQL_TOKEN}`,
      },
      // you can disable result caching here if you want to
      // (this does not work if you are rendering your page with `export const dynamic = "force-static"`)
      // fetchOptions: { cache: "no-store" },
    }),
  })
})

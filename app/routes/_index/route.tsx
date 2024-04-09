import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node"
import { useLoaderData, useLocation } from "@remix-run/react"
import { renderToString } from "react-dom/server"
import { InstantSearchSSRProvider, getServerState } from "react-instantsearch"
import { Intro } from "~/components/Intro"
import { Newsletter } from "~/components/Newsletter"
import { SITE_DESCRIPTION, SITE_TAGLINE } from "~/utils/constants"
import { getMetaTags } from "~/utils/meta"
import { Search } from "./Search"

export const meta: MetaFunction = ({ matches }) => {
  return getMetaTags({
    title: SITE_TAGLINE,
    description: SITE_DESCRIPTION,
    parentMeta: matches.find(({ id }) => id === "root")?.meta,
  })
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url)
  const serverState = await getServerState(<Search url={url} />, { renderToString })

  return { serverState, url }
}

export default function Index() {
  const { key } = useLocation()
  const { serverState, url } = useLoaderData<typeof loader>()

  return (
    <>
      <section className="flex flex-col gap-y-6">
        <Intro
          title="Discover Open Source Alternatives to Popular Software"
          description="We’ve curated some great open source alternatives to tools that your business requires in day-to-day operations."
          className="max-w-[40rem] text-pretty"
        />

        <Newsletter placeholder="Get weekly newsletter" buttonVariant="fancy" />
      </section>

      <InstantSearchSSRProvider key={key} {...serverState}>
        <Search url={url} />
      </InstantSearchSSRProvider>
    </>
  )
}

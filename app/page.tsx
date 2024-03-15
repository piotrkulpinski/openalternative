import { Featured } from "~/components/Featured"
import { Grid } from "~/components/Grid"
import { Intro } from "~/components/Intro"
import { SubscribeForm } from "~/components/SubscribeForm"
import { ToolCard } from "~/components/cards/ToolCard"
import { Tool, getToolsQuery } from "~/queries/tools"
import { getClient } from "~/services/apollo"
import { filtersCache } from "~/utils/search-params"

type HomeProps = {
  searchParams: Record<string, string | string[] | undefined>
}

export const runtime = "edge"

export default async function Home({ searchParams }: HomeProps) {
  const { query } = filtersCache.parse(searchParams)

  const { data } = await getClient().query({
    query: getToolsQuery,
    variables: { orderBy: { score: "desc" }, filter: { isDraft: false } },
    // variables: { filter: { name: { _eq: query } } },
  })

  const tools = data.tools

  return (
    <>
      <Intro>
        <h2 className="max-w-3xl text-[21px]/normal text-gray-600">
          Discover <strong className="!font-semibold text-black">Open Source Alternatives</strong>{" "}
          to Popular Software.
          <br />
          We’ve curated some great open source alternatives to tools that your business requires in
          day-to-day operations.
        </h2>

        <SubscribeForm />
        <Featured />
      </Intro>

      <Grid>{tools?.map((tool) => <ToolCard key={tool?.id} tool={tool as Tool} />)}</Grid>
    </>
  )
}

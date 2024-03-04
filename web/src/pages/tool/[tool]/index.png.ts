import type { APIRoute } from "astro"
import { generateOgImageForTool } from "~/opengraph"
import { type Tool, getToolsQuery } from "~/queries/tools"
import { client } from "~/services/apollo"

// Static Paths
export const getStaticPaths = async () => {
  const { data } = await client.query({
    query: getToolsQuery,
  })

  return (
    data.tools?.map(tool => ({
      params: { tool: tool?.slug },
      props: { tool },
    })) ?? []
  )
}

export const GET: APIRoute = async ({ props }) =>
  new Response(await generateOgImageForTool(props.tool as Tool), {
    headers: { "Content-Type": "image/png" },
  })

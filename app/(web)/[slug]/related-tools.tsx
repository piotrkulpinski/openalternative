import { Listing } from "~/components/web/listing"
import { ToolList } from "~/components/web/tools/tool-list"
import type { ToolOne } from "~/server/tools/payloads"
import { findRelatedTools } from "~/server/tools/queries"

export const RelatedTools = async ({ tool }: { tool: ToolOne }) => {
  const tools = await findRelatedTools({ slug: tool.slug })

  if (!tools.length) {
    return null
  }

  return (
    <Listing title={`Open source alternatives similar to ${tool.name}:`}>
      <ToolList tools={tools} />
    </Listing>
  )
}

import type { Alternative, Tool } from "@prisma/client"
import { fetch as webFetch } from "@remix-run/web-fetch"
import { EventSchemas, Inngest } from "inngest"

type Events = {
  "tool.created": { data: { id: Tool["id"] } }
  "alternative.created": { data: { id: Alternative["id"] } }
}

export const inngest = new Inngest({
  id: "openalternative",
  fetch: webFetch as typeof fetch,
  schemas: new EventSchemas().fromRecord<Events>(),
})

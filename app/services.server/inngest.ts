import { fetch as webFetch } from "@remix-run/web-fetch"
import { EventSchemas, Inngest } from "inngest"

type Events = {
  "tool.created": { data: { id: number } }
}

export const inngest = new Inngest({
  id: "openalternative",
  fetch: webFetch as typeof fetch,
  schemas: new EventSchemas().fromRecord<Events>(),
})

import { fetch as webFetch } from "@remix-run/web-fetch"
import { EventSchemas, Inngest } from "inngest"

import type { Events } from "~/functions.server"

export const inngest = new Inngest({
  id: "openalternative",
  fetch: webFetch as typeof fetch,
  schemas: new EventSchemas().fromRecord<Events>(),
})

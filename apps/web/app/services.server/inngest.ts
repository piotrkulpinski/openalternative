import type { Alternative, Tool } from "@prisma/client"
import { EventSchemas, Inngest } from "inngest"

type Events = {
  "tool.created": { data: { id: Tool["id"] } }
  "alternative.created": { data: { id: Alternative["id"] } }
}

export const inngest = new Inngest({
  id: "openalternative",
  schemas: new EventSchemas().fromRecord<Events>(),
})

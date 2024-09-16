import type { Alternative, Tool } from "@openalternative/db"
import { EventSchemas, Inngest } from "inngest"

type Events = {
  "tool.created": { data: Tool }
  "tool.deleted": { data: Tool }
  "alternative.created": { data: Alternative }
  "alternative.deleted": { data: Alternative }
}

export const inngest = new Inngest({
  id: "openalternative",
  schemas: new EventSchemas().fromRecord<Events>(),
})

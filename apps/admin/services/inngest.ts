import type { Alternative, Tool } from "@openalternative/db"
import { EventSchemas, Inngest } from "inngest"

type Events = {
  "tool.created": { data: Pick<Tool, "id"> }
  "tool.deleted": { data: Pick<Tool, "slug"> }
  "alternative.created": { data: Pick<Alternative, "id"> }
  "alternative.deleted": { data: Pick<Alternative, "slug"> }
}

export const inngest = new Inngest({
  id: "openalternative",
  schemas: new EventSchemas().fromRecord<Events>(),
})

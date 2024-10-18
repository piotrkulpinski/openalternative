import type { Alternative, Tool } from "@openalternative/db"
import { EventSchemas, Inngest } from "inngest"
import { siteConfig } from "~/config/site"

type Events = {
  "tool.published": { data: Pick<Tool, "id"> }
  "tool.deleted": { data: Pick<Tool, "slug"> }
  "alternative.created": { data: Pick<Alternative, "id"> }
  "alternative.deleted": { data: Pick<Alternative, "slug"> }
}

export const inngest = new Inngest({
  id: siteConfig.name,
  schemas: new EventSchemas().fromRecord<Events>(),
})

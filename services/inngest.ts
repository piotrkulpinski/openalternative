import { EventSchemas, Inngest } from "inngest"

type ToolEventData = { slug: string }
type AlternativeEventData = { slug: string }

type Events = {
  "tool.submitted": { data: ToolEventData }
  "tool.expedited": { data: ToolEventData }
  "tool.featured": { data: ToolEventData }
  "tool.scheduled": { data: ToolEventData }
  "tool.published": { data: ToolEventData }
  "tool.deleted": { data: ToolEventData }
  "alternative.created": { data: AlternativeEventData }
  "alternative.deleted": { data: AlternativeEventData }
}

export const inngest = new Inngest({
  id: "openalternative",
  schemas: new EventSchemas().fromRecord<Events>(),
})

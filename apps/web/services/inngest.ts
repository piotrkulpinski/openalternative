import { db } from "@openalternative/db"
import { EventSchemas, Inngest, InngestMiddleware } from "inngest"

type ToolEventData = { slug: string }
type AlternativeEventData = { slug: string }

type Events = {
  "tool.submitted": { data: ToolEventData }
  "tool.expedited": { data: ToolEventData }
  "tool.featured": { data: ToolEventData }
  "tool.scheduled": { data: ToolEventData }
  "tool.published": { data: ToolEventData }
  "alternative.created": { data: AlternativeEventData }
}

const prismaMiddleware = new InngestMiddleware({
  name: "Prisma Middleware",
  init: () => ({
    onFunctionRun: () => ({
      transformInput: () => ({ ctx: { db } }),
    }),
  }),
})

export const inngest = new Inngest({
  id: "openalternative",
  schemas: new EventSchemas().fromRecord<Events>(),
  middleware: [prismaMiddleware],
})

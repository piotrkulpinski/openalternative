import { EventSchemas, Inngest } from "inngest"

import type { Events } from "~/functions.server"

export const inngest = new Inngest({
  id: "openalternative",
  schemas: new EventSchemas().fromRecord<Events>(),
})

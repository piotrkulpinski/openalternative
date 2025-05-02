import { Logtail } from "@logtail/node"
import { Inngest, InngestMiddleware } from "inngest"
import { env } from "~/env"
import { db } from "~/services/db"

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
  logger: new Logtail(env.LOGTAIL_SOURCE_TOKEN, { sendLogsToConsoleOutput: true }),
  middleware: [prismaMiddleware],
})

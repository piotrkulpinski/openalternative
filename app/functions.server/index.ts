import { Tool } from "@prisma/client"
import { SerializeFrom } from "@remix-run/node"

export type Events = {
  "tool.created": { data: SerializeFrom<Tool> }
}

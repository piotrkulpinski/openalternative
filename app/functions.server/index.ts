import { z } from "zod"
import { Tool } from "@prisma/client"
import { SerializeFrom } from "@remix-run/node"

const fetchGithubRepoSchema = z.object({
  id: z.number(),
  owner: z.string(),
  name: z.string(),
  bump: z.number().nullable(),
})

export type Events = {
  "fetch-github-repo": { data: z.infer<typeof fetchGithubRepoSchema> }

  // Tools
  "tool.created": { data: SerializeFrom<Tool> }
}

import { z } from "zod"
import { Tool } from "@prisma/client"

const fetchGithubRepoSchema = z.object({
  id: z.number(),
  owner: z.string(),
  name: z.string(),
})

export type Events = {
  "fetch-github-repo": { data: z.infer<typeof fetchGithubRepoSchema> }

  // Tools
  "tool.created": { data: Tool }
}

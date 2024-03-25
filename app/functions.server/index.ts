import { z } from "zod"

import { cronFetchGithubRepo } from "./cron/fetchGithubRepo"
import { cronUpdateTools } from "./cron/updateTools"
import { toolCreated } from "./tool/created"
import { Tool } from "@prisma/client"

const fetchGithubRepoSchema = z.object({
  id: z.number(),
  owner: z.string(),
  name: z.string(),
})

export type Events = {
  "cron.fetch-github-repo": { data: z.infer<typeof fetchGithubRepoSchema> }

  // Tools
  "tool.created": { data: Tool }
}

export const functions = [
  // Fetches
  cronUpdateTools,
  cronFetchGithubRepo,

  // Tools
  toolCreated,
]

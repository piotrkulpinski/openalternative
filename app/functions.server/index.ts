import { z } from "zod"

import { fetchGithubRepo } from "./fetch/fetchGithubRepo"
import { updateTools } from "./updateTools"

const fetchGithubRepoSchema = z.object({
  id: z.number(),
  owner: z.string(),
  name: z.string(),
})

export type Events = {
  "fetch.github-repo": { data: z.infer<typeof fetchGithubRepoSchema> }
}

export const functions = [
  updateTools,

  // Fetches
  fetchGithubRepo,
]

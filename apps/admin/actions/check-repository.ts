"use server"

import { z } from "zod"
import { getRepoOwnerAndName } from "~/lib/repositories"
import { authedProcedure } from "~/lib/safe-actions"
import { GitHubTechStackAnalyzer } from "~/lib/tech-stack-analyzer"
import { prisma } from "~/services/prisma"

export const analyzeRepository = authedProcedure
  .createServerAction()
  .input(z.object({ id: z.string() }))
  .handler(async ({ input: { id } }) => {
    const { repository } = await prisma.tool.findUniqueOrThrow({ where: { id } })
    const repo = getRepoOwnerAndName(repository)

    if (!repo) return null

    const github = new GitHubTechStackAnalyzer()
    const analysis = await github.analyzeTechStack(repo.owner, repo.name)
    return analysis
  })

import { prisma } from "@openalternative/db"
import { ToolStatus } from "@openalternative/db/client"
import type { Metadata } from "next"
import { H4 } from "~/components/common/heading"
import { Stack } from "~/components/common/stack"
import { NavigationLink } from "~/components/web/ui/navigation-link"
import { Prose } from "~/components/web/ui/prose"
import { metadataConfig } from "~/config/metadata"
import { getCachedAnalyses, getCachedAnalysis } from "~/lib/stack-analysis"
import { stackManyPayload } from "~/server/web/stacks/payloads"
import { toolOnePayload } from "~/server/web/tools/payloads"
import { StackAnalysis } from "./analysis"

type PageProps = {
  params: Promise<{ repo?: string[] }>
}

const url = "/tools/github-stack-analyzer"

export const metadata: Metadata = {
  title: "GitHub Tech Stack Analyzer",
  description:
    "Analyze the tech stack of any public GitHub repository instantly. Discover the frameworks, libraries, and tools used in any project.",
  openGraph: { ...metadataConfig.openGraph, url },
  alternates: { ...metadataConfig.alternates, canonical: url },
}

export default async function StackAnalyzerPage({ params }: PageProps) {
  const { repo } = await params
  const repoName = repo?.join("/")

  if (repoName) {
    const cached = await getCachedAnalysis(repoName)

    if (cached) {
      const [stacks, tool] = await Promise.all([
        prisma.stack.findMany({
          where: { slug: { in: cached.stack } },
          orderBy: [{ tools: { _count: "desc" } }, { name: "asc" }],
          select: stackManyPayload,
        }),

        prisma.tool.findFirst({
          where: {
            repository: { endsWith: repoName },
            status: ToolStatus.Published,
          },
          select: toolOnePayload,
        }),
      ])

      return <StackAnalysis analysis={{ stacks, tool, repository: cached.repository }} />
    }
  }

  const analyses = await getCachedAnalyses()

  if (!analyses.length) {
    return null
  }

  return (
    <Stack direction="column">
      <H4>Recently analyzed repositories:</H4>

      <Prose className="text-lg">
        <ul>
          {analyses.map(({ repository }) => (
            <li key={repository.nameWithOwner}>
              <NavigationLink href={`${url}/${repository.nameWithOwner}`}>
                {repository.nameWithOwner}
              </NavigationLink>
            </li>
          ))}
        </ul>
      </Prose>
    </Stack>
  )
}

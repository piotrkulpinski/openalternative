import { formatNumber, getUrlHostname } from "@curiousleaf/utils"
import type { RepositoryData } from "@openalternative/github"
import { formatDistanceToNowStrict } from "date-fns"
import {
  ArrowUpRightIcon,
  EyeIcon,
  GitForkIcon,
  HistoryIcon,
  StarIcon,
  TimerIcon,
  UsersIcon,
} from "lucide-react"
import Link from "next/link"
import { H5 } from "~/components/common/heading"
import { Stack } from "~/components/common/stack"
import { ExternalLink } from "~/components/web/external-link"
import { StackList } from "~/components/web/stacks/stack-list"
import { Button } from "~/components/web/ui/button"
import { Card } from "~/components/web/ui/card"
import { Insights } from "~/components/web/ui/insights"
import { Prose } from "~/components/web/ui/prose"
import { Section, SectionContent, SectionSidebar } from "~/components/web/ui/section"
import { config } from "~/config"
import type { StackMany } from "~/server/web/stacks/payloads"
import type { ToolOne } from "~/server/web/tools/payloads"

type StackAnalysisProps = {
  analysis?: {
    stacks: StackMany[]
    tool: ToolOne | null
    repository: RepositoryData
  }
}

export const StackAnalysis = ({ analysis }: StackAnalysisProps) => {
  if (!analysis) return null

  const insights = [
    {
      label: "Stars",
      value: formatNumber(analysis.repository.stars, "standard"),
      icon: <StarIcon />,
    },
    {
      label: "Forks",
      value: formatNumber(analysis.repository.forks, "standard"),
      icon: <GitForkIcon />,
    },
    {
      label: "Contributors",
      value: formatNumber(analysis.repository.contributors, "standard"),
      icon: <UsersIcon />,
    },
    {
      label: "Watchers",
      value: formatNumber(analysis.repository.watchers, "standard"),
      icon: <EyeIcon />,
    },
    {
      label: "Last commit",
      value: formatDistanceToNowStrict(analysis.repository.pushedAt, { addSuffix: true }),
      title: analysis.repository.pushedAt.toString(),
      icon: <TimerIcon />,
    },
    {
      label: "Repository age",
      value: formatDistanceToNowStrict(analysis.repository.createdAt),
      title: analysis.repository.createdAt.toString(),
      icon: <HistoryIcon />,
    },
  ]

  return (
    <Stack direction="column" className="gap-y-6">
      <Prose>
        <h4>
          Tech Stack of <code>{analysis.repository.nameWithOwner}</code>
        </h4>
      </Prose>

      <Section>
        <SectionContent>
          <StackList stacks={analysis.stacks} />
        </SectionContent>

        <SectionSidebar>
          <Card hover={false} focus={false} className="items-stretch bg-transparent">
            <Stack direction="column">
              <H5 as="strong">Repository details:</H5>

              {analysis.repository.description && (
                <p className="text-sm text-muted">
                  {analysis.repository.description}{" "}
                  {analysis.repository.homepageUrl && (
                    <ExternalLink
                      href={analysis.repository.homepageUrl}
                      className="inline-flex items-center gap-1 font-medium text-sm text-primary hover:underline"
                    >
                      {getUrlHostname(analysis.repository.homepageUrl)}
                      <ArrowUpRightIcon className="size-3.5" />
                    </ExternalLink>
                  )}
                </p>
              )}
            </Stack>

            <Insights insights={insights} className="text-sm" />

            {analysis.tool && (
              <Button suffix={<ArrowUpRightIcon />} asChild>
                <Link href={`/${analysis.tool.slug}`}>View on {config.site.name}</Link>
              </Button>
            )}
          </Card>
        </SectionSidebar>
      </Section>
    </Stack>
  )
}

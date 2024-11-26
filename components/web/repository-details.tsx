import { formatNumber } from "@curiousleaf/utils"
import { formatDistanceToNowStrict } from "date-fns"
import { CopyrightIcon, GitForkIcon, HistoryIcon, StarIcon, TimerIcon } from "lucide-react"
import type { ComponentProps } from "react"
import { H5 } from "~/components/common/heading"
import { Stack } from "~/components/common/stack"
import { Button } from "~/components/web/ui/button"
import { Insights } from "~/components/web/ui/insights"
import { NavigationLink } from "~/components/web/ui/navigation-link"
import type { ToolOne } from "~/server/tools/payloads"
import { cx } from "~/utils/cva"
import { BrandGitHubIcon } from "../common/icons/brand-github"

type RepositoryDetailsProps = ComponentProps<"div"> & {
  tool: ToolOne
}

export const RepositoryDetails = ({ className, tool, ...props }: RepositoryDetailsProps) => {
  const insights = [
    { label: "Stars", value: formatNumber(tool.stars, "standard"), icon: <StarIcon /> },
    { label: "Forks", value: formatNumber(tool.forks, "standard"), icon: <GitForkIcon /> },
    ...(tool.lastCommitDate
      ? [
          {
            label: "Last commit",
            value: formatDistanceToNowStrict(tool.lastCommitDate, { addSuffix: true }),
            title: tool.lastCommitDate.toISOString(),
            icon: <TimerIcon />,
          },
        ]
      : []),
    ...(tool.firstCommitDate
      ? [
          {
            label: "Repository age",
            value: formatDistanceToNowStrict(tool.firstCommitDate),
            title: tool.firstCommitDate.toISOString(),
            icon: <HistoryIcon />,
          },
        ]
      : []),
    ...(tool.license
      ? [
          {
            label: "License",
            value: tool.license.name,
            link: `/licenses/${tool.license.slug}`,
            icon: <CopyrightIcon />,
          },
        ]
      : []),
  ]

  return (
    <div className={cx("flex flex-col gap-4 rounded-lg border p-5", className)} {...props}>
      <Stack direction="column">
        <H5 as="strong">Repository details:</H5>
        <Insights insights={insights} className="text-sm" />
      </Stack>

      {!!tool.languages.length && (
        <Stack direction="column">
          <H5 as="strong">Written in:</H5>

          <Stack>
            {tool.languages?.map(({ percentage, language }) => (
              <NavigationLink
                key={language.slug}
                href={`/languages/${language.slug}`}
                className="gap-1"
              >
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: language.color ?? undefined }}
                />
                {language.name} <span className="opacity-50">({percentage}%)</span>
              </NavigationLink>
            ))}
          </Stack>
        </Stack>
      )}

      {tool.repository && (
        <Button
          size="md"
          variant="secondary"
          prefix={<BrandGitHubIcon />}
          // onClick={() => posthog.capture("repository_clicked", { url: tool.repository })}
          className="mt-1 self-start"
          asChild
        >
          <a href={tool.repository} target="_blank" rel="noreferrer nofollow">
            View Repository
          </a>
        </Button>
      )}
    </div>
  )
}

import { formatNumber } from "@curiousleaf/utils"
import type { SerializeFrom } from "@remix-run/node"
import { formatDistanceToNowStrict } from "date-fns"
import { CopyrightIcon, GitForkIcon, HistoryIcon, StarIcon, TimerIcon } from "lucide-react"
import { posthog } from "posthog-js"
import type { HTMLAttributes } from "react"
import { Button } from "~/components/ui/button"
import { H5 } from "~/components/ui/heading"
import { BrandGitHubIcon } from "~/components/ui/icons/brand-github"
import { Insights } from "~/components/ui/insights"
import { NavigationLink } from "~/components/ui/navigation-link"
import { Stack } from "~/components/ui/stack"
import type { LanguageToToolMany, ToolOne } from "~/services.server/api"
import { cx } from "~/utils/cva"

type RepositoryDetailsProps = HTMLAttributes<HTMLElement> & {
  tool: SerializeFrom<ToolOne>
  languages: SerializeFrom<LanguageToToolMany[]>
}

export const RepositoryDetails = ({
  className,
  tool,
  languages,
  ...props
}: RepositoryDetailsProps) => {
  const insights = [
    { label: "Stars", value: formatNumber(tool.stars, "standard"), icon: StarIcon },
    { label: "Forks", value: formatNumber(tool.forks, "standard"), icon: GitForkIcon },
    ...(tool.lastCommitDate
      ? [
          {
            label: "Last commit",
            value: formatDistanceToNowStrict(tool.lastCommitDate, { addSuffix: true }),
            title: tool.lastCommitDate,
            icon: TimerIcon,
          },
        ]
      : []),
    ...(tool.firstCommitDate
      ? [
          {
            label: "Repository age",
            value: formatDistanceToNowStrict(tool.firstCommitDate),
            title: tool.firstCommitDate,
            icon: HistoryIcon,
          },
        ]
      : []),
    ...(tool.license
      ? [
          {
            label: "License",
            value: tool.license.name,
            link: `/licenses/${tool.license.slug}`,
            icon: CopyrightIcon,
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

      {!!languages.length && (
        <Stack direction="column">
          <H5 as="strong">Written in:</H5>

          <Stack>
            {languages?.map(({ percentage, language }) => (
              <NavigationLink
                key={language.slug}
                to={`/languages/${language.slug}`}
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
          onClick={() => posthog.capture("repository_clicked", { url: tool.repository })}
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

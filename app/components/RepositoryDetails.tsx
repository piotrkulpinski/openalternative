import { SerializeFrom } from "@remix-run/node"
import { HTMLAttributes } from "react"
import { ToolOne } from "~/services.server/api"
import { cx } from "~/utils/cva"
import { Series } from "./Series"
import { H5 } from "./Heading"
import { format } from "timeago.js"
import { CopyrightIcon, GitForkIcon, MoveRightIcon, StarIcon, TimerIcon } from "lucide-react"
import { Insights } from "./Insights"
import { Button } from "./Button"
import { NavigationLink } from "./NavigationLink"
import { posthog } from "posthog-js"

type RepositoryDetailsProps = HTMLAttributes<HTMLElement> & {
  tool: SerializeFrom<ToolOne>
}

export const RepositoryDetails = ({ className, tool, ...props }: RepositoryDetailsProps) => {
  const insights = [
    { label: "Stars", value: tool.stars.toLocaleString(), icon: StarIcon },
    { label: "Forks", value: tool.forks.toLocaleString(), icon: GitForkIcon },
    {
      label: "Last commit",
      value: tool.lastCommitDate && format(tool.lastCommitDate),
      title: tool.lastCommitDate ?? undefined,
      icon: TimerIcon,
    },
    { label: "License", value: tool.license, icon: CopyrightIcon },
  ]

  return (
    <div
      className={cx(
        "flex flex-col gap-5 rounded-lg border px-6 py-5 dark:border-neutral-700/50",
        className
      )}
      {...props}
    >
      <Series direction="column">
        <H5>Repository details:</H5>
        <Insights insights={insights} className="text-sm" />
      </Series>

      {!!tool.languages.length && (
        <Series direction="column">
          <H5>Written in:</H5>

          {tool.languages?.map(({ percentage, language }) => (
            <h6 key={language.slug}>
              <NavigationLink to={`/languages/${language.slug}`}>
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: language.color ?? undefined }}
                />
                {language.name} <span className="opacity-50">({percentage}%)</span>
              </NavigationLink>
            </h6>
          ))}
        </Series>
      )}

      {tool.repository && (
        <Button
          size="md"
          variant="secondary"
          suffix={<MoveRightIcon className="duration-150 group-hover:translate-x-0.5" />}
          onClick={() => posthog.capture("repository_clicked", { url: tool.repository })}
          className="mt-1"
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

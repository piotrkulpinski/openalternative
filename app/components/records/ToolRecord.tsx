import { Tool } from "@prisma/client"
import { GitForkIcon, StarIcon, TimerIcon } from "lucide-react"
import { HTMLAttributes } from "react"
import { format } from "timeago.js"
import { Card } from "../Card"

type ToolRecordProps = HTMLAttributes<HTMLElement> & {
  tool: Tool
}

export const ToolRecord = ({ tool, ...props }: ToolRecordProps) => {
  const insights = [
    { label: "Stars", value: tool.stars.toLocaleString(), icon: StarIcon },
    { label: "Forks", value: tool.forks.toLocaleString(), icon: GitForkIcon },
    { label: "Last commit", value: format(tool.lastCommitDate ?? ""), icon: TimerIcon },
  ]

  return (
    <Card
      to={`/${tool.slug}`}
      name={tool.name}
      description={tool.description}
      website={tool.website}
      isFeatured={tool.isFeatured}
      {...props}
    >
      <ul className="mt-auto w-full">
        {insights.map(({ label, value, icon: Icon }) => (
          <li key={label} className="fade-in flex min-w-0 items-center gap-3 py-1 text-xs">
            <p className="flex shrink-0 items-center gap-1.5 text-neutral-500">
              <Icon className="size-3.5 opacity-75 max-sm:hidden" /> {label}
            </p>
            <span className="h-px flex-1 bg-current opacity-15" />
            <span className="shrink-0 font-medium">{value.toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </Card>
  )
}

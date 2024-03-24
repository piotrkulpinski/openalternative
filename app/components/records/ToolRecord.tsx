import { GitForkIcon, StarIcon, TimerIcon } from "lucide-react"
import { HTMLAttributes } from "react"
import { format } from "timeago.js"
import { Card } from "../Card"
import { Insights } from "../Insights"
import { ToolMany } from "~/services.server/api"
import { SerializeFrom } from "@remix-run/node"

type ToolRecordProps = HTMLAttributes<HTMLElement> & {
  tool: SerializeFrom<ToolMany>
}

export const ToolRecord = ({ tool, ...props }: ToolRecordProps) => {
  const insights = [
    { label: "Stars", value: tool.stars.toLocaleString(), icon: StarIcon },
    { label: "Forks", value: tool.forks.toLocaleString(), icon: GitForkIcon },
    {
      label: "Last commit",
      value: tool.lastCommitDate && format(tool.lastCommitDate),
      icon: TimerIcon,
    },
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
      <Insights insights={insights} className="mt-auto" />
    </Card>
  )
}

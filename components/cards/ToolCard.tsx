import { Badge, H4, Paragraph, Series } from "@curiousleaf/design"
import { StarIcon } from "lucide-react"
import { Card } from "~/components/Card"
import { Favicon } from "../Favicon"
import { ComponentPropsWithoutRef } from "react"
import { Tool } from "~/queries/tools"

type ToolCardProps = Omit<ComponentPropsWithoutRef<typeof Card>, "href"> & {
  tool: Partial<Tool>
}

export const ToolCard = ({ tool, ...props }: ToolCardProps) => {
  return (
    <Card href={`/tool/${tool.slug}`} {...props}>
      <Favicon url={tool.website} />

      <div className="flex flex-col items-start gap-2">
        <Series>
          <H4>{tool.name}</H4>

          <Badge
            size="sm"
            theme="gray"
            variant="outline"
            prefix={<StarIcon className="max-sm:hidden" />}
            className="opacity-0 group-hover:opacity-100"
          >
            <strong className="text-gray-700">{tool.stars?.toLocaleString()}</strong> Stars
          </Badge>
        </Series>

        <Paragraph size="sm" className="line-clamp-2 text-gray-600">
          {tool.description}
        </Paragraph>
      </div>

      {!!tool.category?.length && (
        <Series size="sm" className="mt-auto">
          <Badge theme="purple" variant="outline">
            {tool.category[0]?.name}
          </Badge>

          {tool.category.length > 1 && (
            <span className="text-2xs text-gray-500">+{tool.category.length - 1} more</span>
          )}
        </Series>
      )}
    </Card>
  )
}

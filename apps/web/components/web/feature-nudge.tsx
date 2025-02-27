import type { Tool } from "@openalternative/db/client"
import type { ComponentProps } from "react"
import { toast } from "sonner"
import { Button } from "~/components/common/button"
import { Card } from "~/components/common/card"
import { Link } from "~/components/common/link"
import { Stack } from "~/components/common/stack"
import { config } from "~/config"
import { cx } from "~/utils/cva"

type FeatureNudgeProps = ComponentProps<typeof Card> & {
  tool: Tool
  t: string | number
}

export const FeatureNudge = ({ className, tool, t, ...props }: FeatureNudgeProps) => {
  return (
    <Card hover={false} focus={false} className={cx("max-w-xs", className)} {...props}>
      <p className="text-sm text-secondary-foreground">
        <strong>{tool.name}</strong> has already been published on {config.site.name}. If you want,
        you can feature it for extra exposure.
      </p>

      <Stack size="sm" className="w-full">
        <Button size="md" className="flex-1" onClick={() => toast.dismiss(t)} asChild>
          <Link href={`/submit/${tool.slug}`}>Feature {tool.name}</Link>
        </Button>

        <Button size="md" variant="secondary" onClick={() => toast.dismiss(t)}>
          Dismiss
        </Button>
      </Stack>
    </Card>
  )
}

import type { Tool } from "@openalternative/db/client"
import Link from "next/link"
import type { ComponentProps } from "react"
import { toast } from "sonner"
import { Stack } from "~/components/common/stack"
import { Button } from "~/components/web/ui/button"
import { config } from "~/config"
import { cx } from "~/utils/cva"

type FeatureNudgeProps = ComponentProps<typeof Stack> & {
  tool: Tool
  t: string | number
}

export const FeatureNudge = ({ className, tool, t, ...props }: FeatureNudgeProps) => {
  return (
    <Stack direction="column" size="lg" className={cx("px-3 pb-0.5", className)} {...props}>
      <p className="text-sm text-foreground/65">
        <strong>{tool.name}</strong> has already been published. If you want, you can feature it for
        extra exposure.
      </p>

      <Stack size="sm">
        <Button size="sm" onClick={() => toast.dismiss(t)} asChild>
          <Link href={`/submit/${tool.slug}`} prefetch={false}>
            Feature {tool.name} on {config.site.name}
          </Link>
        </Button>

        <Button size="sm" variant="secondary" onClick={() => toast.dismiss(t)}>
          Dismiss
        </Button>
      </Stack>
    </Stack>
  )
}

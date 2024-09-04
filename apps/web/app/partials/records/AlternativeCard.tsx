import type { SerializeFrom } from "@remix-run/node"
import { Link } from "@remix-run/react"
import { Button } from "apps/web/app/components/Button"
import { Card } from "apps/web/app/components/Card"
import { Favicon } from "apps/web/app/components/Favicon"
import { H4 } from "apps/web/app/components/Heading"
import type { AlternativeOne } from "apps/web/app/services.server/api"
import { cx } from "cva"
import { ArrowUpRightIcon } from "lucide-react"
import { posthog } from "posthog-js"
import type { HTMLAttributes } from "react"

type AlternativeCardProps = HTMLAttributes<HTMLElement> & {
  alternative: SerializeFrom<AlternativeOne>
}

export const AlternativeCard = ({ className, alternative, ...props }: AlternativeCardProps) => {
  return (
    <Card className={cx("group/button bg-background !animate-none", className)} {...props} asChild>
      <Link
        to={alternative.website}
        target="_blank"
        rel="noopener noreferrer nofollow"
        onClick={() => posthog.capture("alternative_clicked", { url: alternative.slug })}
      >
        <Card.Header>
          <Favicon src={alternative.faviconUrl} title={alternative.name} />

          <H4 as="h3" className="truncate">
            {alternative.name}
          </H4>
        </Card.Header>

        {alternative.description && (
          <Card.Description className="max-w-md line-clamp-4">
            {alternative.description}
          </Card.Description>
        )}

        <Button
          variant={alternative.website.includes("go.") ? "fancy" : "primary"}
          size="lg"
          className="w-full pointer-events-none"
          suffix={<ArrowUpRightIcon />}
          asChild
        >
          <span>Visit Website</span>
        </Button>
      </Link>
    </Card>
  )
}

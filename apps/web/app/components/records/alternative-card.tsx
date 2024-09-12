import type { SerializeFrom } from "@remix-run/node"
import { Link } from "@remix-run/react"
import { cx } from "cva"
import { ArrowUpRightIcon } from "lucide-react"
import { posthog } from "posthog-js"
import type { HTMLAttributes } from "react"
import { Button } from "~/components/ui/button"
import { Card } from "~/components/ui/card"
import { Favicon } from "~/components/ui/favicon"
import { H4 } from "~/components/ui/heading"
import type { AlternativeOne } from "~/services.server/api"

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

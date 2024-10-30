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
import { Prose } from "~/components/ui/prose"
import type { AlternativeOne } from "~/services.server/api"

type AlternativeCardProps = HTMLAttributes<HTMLElement> & {
  alternative: SerializeFrom<AlternativeOne>
}

export const AlternativeCard = ({ className, alternative, ...props }: AlternativeCardProps) => {
  return (
    <Card className={cx("group/button", className)} isRevealed={false} {...props} asChild>
      <Link
        to={alternative.website}
        target="_blank"
        rel="noopener noreferrer nofollow"
        onClick={() => posthog.capture("alternative_clicked", { url: alternative.slug })}
      >
        <Card.Header>
          <Favicon
            src={
              alternative.faviconUrl ||
              `https://www.google.com/s2/favicons?sz=128&domain_url=${alternative.website}`
            }
            title={alternative.name}
          />

          <H4 as="h3" className="truncate flex-1">
            {alternative.name}
          </H4>
        </Card.Header>

        {alternative.description && (
          <Card.Description className="max-w-md line-clamp-4">
            {alternative.description}
          </Card.Description>
        )}

        {alternative.discountAmount && (
          <Prose className="prose-strong:underline text-balance text-sm text-green-600 dark:text-green-400">
            {alternative.discountCode ? (
              <>
                Use code <strong>{alternative.discountCode}</strong> to get{" "}
                <strong>{alternative.discountAmount}</strong>
              </>
            ) : (
              <>
                Get <strong>{alternative.discountAmount}</strong> with this link
              </>
            )}
          </Prose>
        )}

        <Button
          variant={alternative.website.startsWith("https://go") ? "fancy" : "primary"}
          size="lg"
          className="w-full pointer-events-none"
          suffix={<ArrowUpRightIcon />}
          asChild
        >
          <span>Visit {alternative.name}</span>
        </Button>
      </Link>
    </Card>
  )
}

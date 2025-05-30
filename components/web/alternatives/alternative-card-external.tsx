import type { ComponentProps } from "react"
import { Button } from "~/components/common/button"
import { Card, CardDescription, CardHeader, CardIcon } from "~/components/common/card"
import { H4 } from "~/components/common/heading"
import { Icon } from "~/components/common/icon"
import { Discount } from "~/components/web/discount"
import { ExternalLink } from "~/components/web/external-link"
import { Favicon, FaviconImage } from "~/components/web/ui/favicon"
import type { AlternativeOne } from "~/server/web/alternatives/payloads"
import { cx } from "~/utils/cva"

type AlternativeCardExternalProps = ComponentProps<typeof Card> & {
  alternative: AlternativeOne
}

export const AlternativeCardExternal = ({
  className,
  alternative,
  ...props
}: AlternativeCardExternalProps) => {
  return (
    <Card className={cx("group/button", className)} {...props} asChild>
      <ExternalLink
        href={alternative.websiteUrl}
        eventName="click_alternative"
        eventProps={{ url: alternative.websiteUrl }}
      >
        <CardHeader wrap={false}>
          <Favicon src={alternative.faviconUrl} title={alternative.name} />

          <H4 as="h3" className="truncate flex-1">
            {alternative.name}
          </H4>
        </CardHeader>

        {alternative.description && (
          <CardDescription className="max-w-md line-clamp-4">
            {alternative.description}
          </CardDescription>
        )}

        <Discount
          amount={alternative.discountAmount}
          code={alternative.discountCode}
          className="text-sm"
        />

        <Button
          className="pointer-events-none md:w-full"
          suffix={<Icon name="lucide/arrow-up-right" />}
          asChild
        >
          <span>Visit {alternative.name}</span>
        </Button>

        {alternative.faviconUrl && (
          <CardIcon>
            <FaviconImage src={alternative.faviconUrl} title={alternative.name} />
          </CardIcon>
        )}
      </ExternalLink>
    </Card>
  )
}

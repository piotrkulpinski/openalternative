import type { ComponentProps } from "react"
import { Button } from "~/components/common/button"
import { Card, CardDescription, CardHeader } from "~/components/common/card"
import { H4 } from "~/components/common/heading"
import { Icon } from "~/components/common/icon"
import { ExternalLink } from "~/components/web/external-link"
import { Favicon } from "~/components/web/ui/favicon"
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
        <CardHeader>
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

        {alternative.discountAmount && (
          <p className="*:underline *:font-semibold text-pretty text-sm text-green-600 dark:text-green-400">
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
          </p>
        )}

        <Button
          className="pointer-events-none md:w-full"
          suffix={<Icon name="lucide/arrow-up-right" />}
          asChild
        >
          <span>Visit {alternative.name}</span>
        </Button>
      </ExternalLink>
    </Card>
  )
}

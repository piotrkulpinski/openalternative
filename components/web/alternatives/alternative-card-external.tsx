"use client"

import { ArrowUpRightIcon } from "lucide-react"
import Link from "next/link"
import { posthog } from "posthog-js"
import type { HTMLAttributes } from "react"
import { H4 } from "~/components/common/heading"
import { Button } from "~/components/web/ui/button"
import { Card, CardDescription, CardHeader } from "~/components/web/ui/card"
import { Favicon } from "~/components/web/ui/favicon"
import { Prose } from "~/components/web/ui/prose"
import type { AlternativeMany, AlternativeOne } from "~/server/alternatives/payloads"
import { cx } from "~/utils/cva"

type AlternativeCardExternalProps = HTMLAttributes<HTMLElement> & {
  alternative: AlternativeOne | AlternativeMany
}

export const AlternativeCardExternal = ({
  className,
  alternative,
  ...props
}: AlternativeCardExternalProps) => {
  return (
    <Card className={cx("group/button", className)} isRevealed={false} {...props} asChild>
      <Link
        href={alternative.website}
        target="_blank"
        rel="noopener noreferrer nofollow"
        onClick={() => posthog.capture("alternative_clicked", { url: alternative.slug })}
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

        <Button className="pointer-events-none md:w-full" suffix={<ArrowUpRightIcon />} asChild>
          <span>Visit {alternative.name}</span>
        </Button>
      </Link>
    </Card>
  )
}

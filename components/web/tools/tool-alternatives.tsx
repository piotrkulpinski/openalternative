"use client"

import type { ComponentProps } from "react"
import { AlternativeHoverCard } from "~/components/web/alternatives/alternative-hover-card"
import { ShowMore } from "~/components/web/show-more"
import { BrandLink } from "~/components/web/ui/brand-link"
import type { AlternativeMany } from "~/server/web/alternatives/payloads"

type ToolAlternativesProps = Omit<ComponentProps<typeof ShowMore>, "items" | "renderItem"> & {
  alternatives: AlternativeMany[]
}

export const ToolAlternatives = ({ alternatives, limit = 4, ...props }: ToolAlternativesProps) => {
  if (!alternatives.length) return null

  return (
    <ShowMore
      items={alternatives}
      limit={limit}
      renderItem={alternative => (
        <AlternativeHoverCard key={alternative.slug} alternative={alternative}>
          <BrandLink
            href={`/alternatives/${alternative.slug}`}
            name={alternative.name}
            faviconUrl={alternative.faviconUrl}
          />
        </AlternativeHoverCard>
      )}
      {...props}
    />
  )
}

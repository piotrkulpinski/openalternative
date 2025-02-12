"use client"

import { useState } from "react"
import { Button } from "~/components/common/button"
import { Stack } from "~/components/common/stack"
import { AlternativeHoverCard } from "~/components/web/alternatives/alternative-hover-card"
import { BrandLink } from "~/components/web/ui/brand-link"
import type { AlternativeMany } from "~/server/web/alternatives/payloads"

type ToolAlternativesProps = {
  alternatives: AlternativeMany[]
  limit?: number
}

export const ToolAlternatives = ({ alternatives, limit = 4 }: ToolAlternativesProps) => {
  const [showAll, setShowAll] = useState(false)

  const shouldShowAll = showAll || alternatives.length <= limit + 1
  const visibleAlternatives = shouldShowAll ? alternatives : alternatives.slice(0, limit)
  const hiddenCount = alternatives.length - limit

  if (!alternatives.length) return null

  return (
    <Stack size="lg" direction="column">
      <span className="text-sm text-muted-foreground">Open Source Alternative to:</span>

      <Stack>
        {visibleAlternatives.map(alternative => (
          <AlternativeHoverCard key={alternative.slug} alternative={alternative}>
            <BrandLink
              href={`/alternatives/${alternative.slug}`}
              name={alternative.name}
              faviconUrl={alternative.faviconUrl}
            />
          </AlternativeHoverCard>
        ))}

        {!shouldShowAll && hiddenCount > 0 && (
          <Button size="sm" variant="ghost" onClick={() => setShowAll(true)}>
            +{hiddenCount} more
          </Button>
        )}
      </Stack>
    </Stack>
  )
}

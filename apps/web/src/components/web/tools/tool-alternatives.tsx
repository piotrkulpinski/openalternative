import { joinAsSentence } from "@curiousleaf/utils"
import { Stack } from "~/components/common/stack"
import { AlternativeHoverCard } from "~/components/web/alternatives/alternative-hover-card"
import { BrandLink } from "~/components/web/ui/brand-link"
import type { AlternativeMany } from "~/server/web/alternatives/payloads"

type ToolAlternativesProps = {
  alternatives: AlternativeMany[]
}

export const ToolAlternatives = ({ alternatives }: ToolAlternativesProps) => {
  if (!alternatives.length) return null

  return (
    <>
      <h3 className="sr-only">
        Open Source Alternative to {joinAsSentence(alternatives.map(({ name }) => name))}
      </h3>

      <Stack>
        <span className="text-sm">Open Source Alternative to:</span>

        {alternatives.map(alternative => (
          <AlternativeHoverCard key={alternative.slug} alternative={alternative}>
            <BrandLink
              href={`/alternatives/${alternative.slug}`}
              name={alternative.name}
              faviconUrl={alternative.faviconUrl}
            />
          </AlternativeHoverCard>
        ))}
      </Stack>
    </>
  )
}

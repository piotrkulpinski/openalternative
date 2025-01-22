import { joinAsSentence } from "@curiousleaf/utils"
import { Stack } from "~/components/common/stack"
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

        {alternatives.map(({ slug, name, faviconUrl }) => (
          <BrandLink
            key={slug}
            href={`/alternatives/${slug}`}
            name={name}
            faviconUrl={faviconUrl}
          />
        ))}
      </Stack>
    </>
  )
}

"use client"

import type { ComponentProps } from "react"
import { ShowMore } from "~/components/web/show-more"
import { BrandLink } from "~/components/web/ui/brand-link"
import type { StackMany } from "~/server/web/stacks/payloads"

type ToolStacksProps = Omit<ComponentProps<typeof ShowMore>, "items" | "renderItem"> & {
  stacks: StackMany[]
}

export const ToolStacks = ({ stacks, limit = 12, ...props }: ToolStacksProps) => {
  if (!stacks.length) return null

  return (
    <ShowMore
      items={stacks}
      limit={limit}
      renderItem={stack => (
        <BrandLink
          key={stack.slug}
          href={`/stacks/${stack.slug}`}
          name={stack.name}
          faviconUrl={stack.faviconUrl}
        />
      )}
      {...props}
    />
  )
}

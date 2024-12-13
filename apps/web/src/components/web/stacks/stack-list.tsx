import type { StackType } from "@openalternative/db/client"
import type { ComponentProps } from "react"
import { H5 } from "~/components/common/heading"
import { EmptyList } from "~/components/web/empty-list"
import { StackCard, StackCardSkeleton } from "~/components/web/stacks/stack-card"
import { Grid } from "~/components/web/ui/grid"
import type { StackMany } from "~/server/web/stacks/payloads"
import { cx } from "~/utils/cva"

type StackListProps = ComponentProps<typeof Grid> & {
  stacks: StackMany[]
}

const StackList = ({ stacks, className, ...props }: StackListProps) => {
  // Group stacks by type in typesafe way
  const groupedStacks = stacks.reduce<Record<StackType, StackMany[]>>(
    (acc, stack) => {
      const type = stack.type as StackType
      acc[type] = acc[type] || []
      acc[type].push(stack)
      return acc
    },
    {} as Record<StackType, StackMany[]>,
  )

  return (
    <Grid className={cx("grid-cols-1", className)} {...props}>
      {Object.entries(groupedStacks).map(([type, stackList]) => (
        <div key={type} className="flex flex-wrap gap-4">
          <H5 as="strong" className="w-28 mt-3">
            {type}:
          </H5>

          <Grid size="2xs" className="flex-1 gap-4">
            {stackList.map(stack => (
              <StackCard key={stack.slug} stack={stack} />
            ))}
          </Grid>
        </div>
      ))}

      {!Object.entries(groupedStacks).length && <EmptyList>No stacks found.</EmptyList>}
    </Grid>
  )
}

const StackListSkeleton = () => {
  return (
    <Grid className="grid-cols-1">
      {[...Array(24)].map((_, index) => (
        <StackCardSkeleton key={index} />
      ))}
    </Grid>
  )
}

export { StackList, StackListSkeleton }

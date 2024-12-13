import { StackType } from "@openalternative/db/client"
import { type ComponentProps, Fragment } from "react"
import { H6 } from "~/components/common/heading"
import { Stack } from "~/components/common/stack"
import { EmptyList } from "~/components/web/empty-list"
import { StackCardSkeleton } from "~/components/web/stacks/stack-card"
import { BrandLink } from "~/components/web/ui/brand-link"
import { Grid } from "~/components/web/ui/grid"
import type { StackMany } from "~/server/web/stacks/payloads"
import { cx } from "~/utils/cva"

type StackListProps = ComponentProps<typeof Grid> & {
  stacks: StackMany[]
  omitTypes?: StackType[]
}

const stackTypeOrder = [
  StackType.Language,
  StackType.Framework,
  StackType.Tool,
  StackType.SaaS,
  StackType.Analytics,
  StackType.Monitoring,
  StackType.Cloud,
  StackType.ETL,
  StackType.DB,
  StackType.CI,
  StackType.Hosting,
  StackType.API,
  StackType.Storage,
  StackType.Messaging,
  StackType.App,
  StackType.Network,
] as const

const StackList = ({ stacks, omitTypes, className, ...props }: StackListProps) => {
  // Group stacks by type
  const groupedStacks = stacks.reduce<Record<StackType, StackMany[]>>(
    (acc, stack) => {
      const type = stack.type as StackType
      acc[type] = acc[type] || []
      acc[type].push(stack)
      return acc
    },
    {} as Record<StackType, StackMany[]>,
  )

  // Filter and sort stacks
  const sortedStacks = (Object.entries(groupedStacks) as [StackType, StackMany[]][])
    .filter(([type]) => !omitTypes?.includes(type))
    .sort(([a], [b]) => stackTypeOrder.indexOf(a) - stackTypeOrder.indexOf(b))

  return (
    <div
      className={cx("flex flex-col divide-y overflow-clip -my-3 md:-my-4", className)}
      {...props}
    >
      {sortedStacks.map(([type, stackList]) => (
        <Fragment key={type}>
          <div className="flex flex-wrap gap-3 py-3 overflow-clip md:gap-4 md:py-4">
            <H6 as="strong" className="relative w-24 mt-0.5 text-muted md:w-28">
              {type}
              <hr className="absolute -inset-y-5 right-0 z-10 h-auto w-px border-r" />
            </H6>

            <Stack size="lg" className="flex-1">
              {stackList.map(stack => (
                <BrandLink
                  key={stack.slug}
                  href={`/stacks/${stack.slug}`}
                  name={stack.name}
                  faviconUrl={stack.faviconUrl}
                />
              ))}
            </Stack>
          </div>
        </Fragment>
      ))}

      {!sortedStacks.length && <EmptyList>No stacks found.</EmptyList>}
    </div>
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

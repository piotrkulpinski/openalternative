import { StackType } from "@openalternative/db/client"
import { useMemo } from "react"
import { type ComponentProps, Fragment } from "react"
import { H6 } from "~/components/common/heading"
import { Skeleton } from "~/components/common/skeleton"
import { Stack } from "~/components/common/stack"
import { EmptyList } from "~/components/web/empty-list"
import { BrandLink } from "~/components/web/ui/brand-link"
import type { Grid } from "~/components/web/ui/grid"
import type { StackMany } from "~/server/web/stacks/payloads"
import { cx } from "~/utils/cva"

type StackListProps = ComponentProps<typeof Grid> & {
  stacks: StackMany[]
  showCount?: boolean
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

const StackList = ({ stacks, className, showCount = false, ...props }: StackListProps) => {
  const groupedStacks = useMemo(() => {
    return (
      Object.entries(
        stacks.reduce<Record<StackType, StackMany[]>>(
          (acc, stack) => {
            const type = stack.type as StackType
            acc[type] = acc[type] || []
            acc[type].push(stack)
            return acc
          },
          {} as Record<StackType, StackMany[]>,
        ),
      ) as [StackType, StackMany[]][]
    ).sort(([a], [b]) => stackTypeOrder.indexOf(a) - stackTypeOrder.indexOf(b))
  }, [stacks])

  if (!stacks.length) {
    return <EmptyList>No tech stack found for this project. We're working on it!</EmptyList>
  }

  return (
    <div
      className={cx(
        "w-full flex flex-col divide-y divide-foreground/10 overflow-clip border-y border-foreground/10",
        className,
      )}
      {...props}
    >
      {groupedStacks.map(([type, stackList]) => (
        <Fragment key={type}>
          <div className="flex flex-wrap gap-3 py-3 overflow-clip md:gap-4 md:py-4">
            <H6 as="strong" className="relative w-24 mt-0.5 text-foreground md:w-28">
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
                >
                  {showCount && `(${stack._count.tools})`}
                </BrandLink>
              ))}
            </Stack>
          </div>
        </Fragment>
      ))}
    </div>
  )
}

const StackListSkeleton = () => {
  return (
    <div className="flex flex-col divide-y divide-foreground/10 overflow-clip border-y border-foreground/10">
      {[...Array(8)].map((_, index) => (
        <div key={index} className="flex flex-wrap gap-3 py-3 overflow-clip md:gap-4 md:py-4">
          <H6 as="strong" className="relative w-24 mt-0.5 text-foreground md:w-28">
            <Skeleton className="h-6 w-20" />
            <hr className="absolute -inset-y-5 right-0 z-10 h-auto w-px border-r" />
          </H6>

          <Stack size="lg" className="flex-1">
            {[...Array(4)].map((_, index) => (
              <Skeleton key={index} className="h-6 w-32" />
            ))}
          </Stack>
        </div>
      ))}
    </div>
  )
}

export { StackList, StackListSkeleton }

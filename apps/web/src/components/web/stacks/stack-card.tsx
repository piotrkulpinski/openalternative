import Link from "next/link"
import plur from "plur"
import type { ComponentProps } from "react"
import { H6 } from "~/components/common/heading"
import { Skeleton } from "~/components/common/skeleton"
import { Stack } from "~/components/common/stack"
import {
  CardSimple,
  CardSimpleCaption,
  CardSimpleDivider,
  CardSimpleTitle,
} from "~/components/web/ui/card-simple"
import { CardSmall, CardSmallHeader } from "~/components/web/ui/card-small"
import { Favicon } from "~/components/web/ui/favicon"
import type { StackMany } from "~/server/web/stacks/payloads"

type StackCardProps = ComponentProps<typeof CardSimple> & {
  stack: StackMany
}

const StackCard = ({ stack, ...props }: StackCardProps) => {
  return (
    <CardSmallHeader asChild {...props}>
      <CardSmall asChild>
        <Link href={`/stacks/${stack.slug}`} prefetch={false}>
          <Stack size="sm">
            <Favicon src={stack.faviconUrl} title={stack.name} className="size-6 p-[3px]" />

            <H6 as="h4" className="truncate">
              {stack.name}
            </H6>
          </Stack>

          <CardSimpleDivider />

          <CardSimpleCaption>
            {`${stack._count.tools} ${plur("tool", stack._count.tools)}`}
          </CardSimpleCaption>
        </Link>
      </CardSmall>
    </CardSmallHeader>
  )
}

const StackCardSkeleton = () => {
  return (
    <CardSimple>
      <CardSimpleTitle className="w-1/3">
        <Skeleton>&nbsp;</Skeleton>
      </CardSimpleTitle>

      <Skeleton className="h-0.5 flex-1" />

      <CardSimpleCaption className="w-1/4">
        <Skeleton>&nbsp;</Skeleton>
      </CardSimpleCaption>
    </CardSimple>
  )
}

export { StackCard, StackCardSkeleton }

import type { ComponentProps } from "react"
import { Skeleton } from "~/components/common/skeleton"
import { CardSimple, CardSimpleCaption, CardSimpleTitle } from "~/components/web/ui/card-simple"
import { Favicon } from "~/components/web/ui/favicon"
import { NavigationLink } from "~/components/web/ui/navigation-link"
import type { StackMany } from "~/server/web/stacks/payloads"

type StackCardProps = Omit<ComponentProps<typeof NavigationLink>, "href"> & {
  stack: StackMany
}

const StackCard = ({ stack, ...props }: StackCardProps) => {
  return (
    <NavigationLink href={`/stacks/${stack.slug}`} prefetch={false} {...props}>
      <Favicon src={stack.faviconUrl} title={stack.name} className="size-6 p-[3px]" />
      <strong className="font-medium ">{stack.name}</strong>
    </NavigationLink>
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

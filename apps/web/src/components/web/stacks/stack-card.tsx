import plur from "plur"
import type { ComponentProps } from "react"
import { Link } from "~/components/common/link"
import { Skeleton } from "~/components/common/skeleton"
import { Stack } from "~/components/common/stack"
import {
  Tile,
  TileCaption,
  TileDivider,
  TileTitle,
} from "~/components/web/ui/tile"
import { Favicon } from "~/components/web/ui/favicon"
import type { StackMany } from "~/server/web/stacks/payloads"

type StackCardProps = ComponentProps<typeof Tile> & {
  stack: StackMany
}

const StackCard = ({ stack, ...props }: StackCardProps) => {
  return (
    <Tile asChild {...props}>
      <Link href={`/stacks/${stack.slug}`}>
        <Stack size="sm">
          <Favicon src={stack.faviconUrl} title={stack.name} className="size-6 p-[3px]" />
          <TileTitle>{stack.name}</TileTitle>
        </Stack>

        <TileDivider />

        <TileCaption>
          {`${stack._count.tools} ${plur("tool", stack._count.tools)}`}
        </TileCaption>
      </Link>
    </Tile>
  )
}

const StackCardSkeleton = () => {
  return (
    <Tile>
      <TileTitle className="w-1/3">
        <Skeleton>&nbsp;</Skeleton>
      </TileTitle>

      <Skeleton className="h-0.5 flex-1" />

      <TileCaption className="w-1/4">
        <Skeleton>&nbsp;</Skeleton>
      </TileCaption>
    </Tile>
  )
}

export { StackCard, StackCardSkeleton }

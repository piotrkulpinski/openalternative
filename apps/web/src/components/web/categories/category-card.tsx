import plur from "plur"
import type { ComponentProps } from "react"
import { Link } from "~/components/common/link"
import { Skeleton } from "~/components/common/skeleton"
import { Tile, TileCaption, TileDivider, TileTitle } from "~/components/web/ui/tile"
import type { CategoryMany } from "~/server/web/categories/payloads"

type CategoryCardProps = ComponentProps<typeof Tile> & {
  category: CategoryMany
}

const CategoryCard = ({ category, ...props }: CategoryCardProps) => {
  return (
    <Tile asChild {...props}>
      <Link href={`/categories/${category.slug}`}>
        <TileTitle>{category.name}</TileTitle>

        <TileDivider />

        <TileCaption>
          {`${category._count.tools} ${plur("tool", category._count.tools)}`}
        </TileCaption>
      </Link>
    </Tile>
  )
}

const CategoryCardSkeleton = () => {
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

export { CategoryCard, CategoryCardSkeleton }

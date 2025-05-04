import type { ComponentProps } from "react"
import { Icon } from "~/components/common/icon"
import { Link } from "~/components/common/link"
import { Skeleton } from "~/components/common/skeleton"
import { Stack } from "~/components/common/stack"
import { EmptyList } from "~/components/web/empty-list"
import { Tile, TileTitle } from "~/components/web/ui/tile"
import type { CategoryManyNested } from "~/server/web/categories/payloads"

type CategoryListProps = ComponentProps<"div"> & {
  categories: CategoryManyNested[]
}

const CategoryList = ({ categories, className, ...props }: CategoryListProps) => {
  if (!categories.length) {
    return <EmptyList>No categories found.</EmptyList>
  }

  return (
    <div className="columns-3xs -mt-8 gap-6 md:gap-8 md:-mt-10" {...props}>
      {categories.map(({ name, slug, fullPath, subcategories }) => (
        <Stack key={slug} size="lg" direction="column" className="inline-flex w-full mt-8 md:mt-10">
          <Tile key={slug} className="gap-3" asChild>
            <Link href={`/categories/${fullPath}`} className="hover:text-primary">
              <TileTitle className="text-lg group-hover:text-primary">{name}</TileTitle>
            </Link>
          </Tile>

          {subcategories?.length > 0 &&
            subcategories.map(({ name, slug, fullPath }) => (
              <Tile key={slug} className="gap-3 pl-2" asChild>
                <Link href={`/categories/${fullPath}`}>
                  <Icon name="lucide/arrow-right" className="size-3.5 opacity-25" />

                  <TileTitle className="font-normal text-secondary-foreground text-sm group-hover:text-primary group-hover:font-medium">
                    {name}
                  </TileTitle>
                </Link>
              </Tile>
            ))}
        </Stack>
      ))}
    </div>
  )
}

const CategoryListSkeleton = () => {
  return (
    <div className="columns-3xs -mt-8 gap-6 md:gap-8 md:-mt-10">
      {[...Array(6)].map((_, i) => (
        <Stack key={i} size="lg" direction="column" className="inline-flex w-full mt-8 md:mt-10">
          <Tile>
            <TileTitle className="text-lg">
              <Skeleton className="w-40">&nbsp;</Skeleton>
            </TileTitle>
          </Tile>

          {[...Array(5)].map((_, i) => (
            <Tile key={i} className="gap-3 pl-2">
              <Icon name="lucide/arrow-right" className="size-3.5 opacity-25" />

              <TileTitle className="text-sm">
                <Skeleton className="w-24">&nbsp;</Skeleton>
              </TileTitle>
            </Tile>
          ))}
        </Stack>
      ))}
    </div>
  )
}

export { CategoryList, CategoryListSkeleton }

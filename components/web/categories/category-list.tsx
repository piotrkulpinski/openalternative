import Link from "next/link"
import plur from "plur"
import type { ComponentProps } from "react"
import { H4, H5 } from "~/components/common/heading"
import { Skeleton } from "~/components/common/skeleton"
import { EmptyList } from "~/components/web/empty-list"
import { Tile, TileCaption, TileDivider, TileTitle } from "~/components/web/ui/tile"
import type { CategoryManyNested } from "~/server/web/categories/payloads"

type CategoryListProps = ComponentProps<"div"> & {
  categories: CategoryManyNested[]
}

const CategoryList = ({ categories, className, ...props }: CategoryListProps) => {
  if (!categories.length) {
    return <EmptyList>No categories found.</EmptyList>
  }

  return (
    <div className="columns-3xs -mt-8 gap-6 md:gap-8 md:-mt-12 lg:gap-10" {...props}>
      {categories.map(({ name, slug, fullPath, subcategories }) => (
        <div key={slug} className="inline-flex flex-col gap-4 w-full mt-8 md:mt-12">
          <H4 className="text-lg">
            <Link href={`/categories/${fullPath}`} prefetch={false} className="hover:text-primary">
              {name}
            </Link>
          </H4>

          {subcategories?.length > 0 &&
            subcategories.map(({ name, slug, fullPath, subcategories }) => (
              <div key={slug} className="flex flex-col gap-2.5 pl-3">
                <H5 className="text-sm">
                  <Link
                    href={`/categories/${fullPath}`}
                    prefetch={false}
                    className="hover:text-primary"
                  >
                    {name}
                  </Link>
                </H5>

                {subcategories?.length > 0 && (
                  <div className="contents">
                    {subcategories.map(({ name, slug, fullPath, _count }) => (
                      <Tile key={slug} className="pl-3" asChild>
                        <Link href={`/categories/${fullPath}`} prefetch={false}>
                          <TileTitle className="text-sm font-normal text-muted-foreground group-hover:text-foreground">
                            {name}
                          </TileTitle>

                          <TileDivider />

                          <TileCaption className="tabular-nums">
                            {_count.tools} {plur("tool", _count.tools)}
                          </TileCaption>
                        </Link>
                      </Tile>
                    ))}
                  </div>
                )}
              </div>
            ))}
        </div>
      ))}
    </div>
  )
}

const CategoryListSkeleton = () => {
  return (
    <div className="columns-3xs -mt-8 gap-6 md:gap-8 md:-mt-12 lg:gap-10">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="inline-flex flex-col gap-4 w-full mt-8 md:mt-12">
          <H4 className="text-lg">
            <Skeleton className="w-1/2">&nbsp;</Skeleton>
          </H4>

          {[...Array(Math.floor(Math.random() * 3) + 2)].map((_, index) => (
            <div key={index} className="flex flex-col gap-2 pl-2">
              <H5 className="text-sm">
                <Skeleton className="w-2/3">&nbsp;</Skeleton>
              </H5>

              <div className="contents">
                {[...Array(Math.floor(Math.random() * 3) + 2)].map((_, index) => (
                  <Tile key={index} className="pl-2">
                    <TileTitle className="text-xs font-normal text-muted-foreground group-hover:text-foreground">
                      <Skeleton className="w-20">&nbsp;</Skeleton>
                    </TileTitle>

                    <TileDivider />

                    <TileCaption className="tabular-nums">
                      <span className="text-[10px] mr-0.5 opacity-50">#</span>
                      <Skeleton className="inline-block w-4">&nbsp;</Skeleton>
                    </TileCaption>
                  </Tile>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export { CategoryList, CategoryListSkeleton }

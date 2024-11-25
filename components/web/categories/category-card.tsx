import Link from "next/link"
import plur from "plur"
import type { ComponentProps } from "react"
import { Skeleton } from "~/components/common/skeleton"
import {
  CardSimple,
  CardSimpleCaption,
  CardSimpleDivider,
  CardSimpleTitle,
} from "~/components/web/ui/card-simple"
import type { CategoryMany } from "~/server/categories/payloads"

type CategoryCardProps = ComponentProps<typeof CardSimple> & {
  category: CategoryMany
  showCount?: boolean
}

const CategoryCard = ({ category, showCount, ...props }: CategoryCardProps) => {
  return (
    <CardSimple asChild {...props}>
      <Link href={`/categories/${category.slug}`}>
        <CardSimpleTitle>{category.name}</CardSimpleTitle>

        <CardSimpleDivider />

        <CardSimpleCaption>
          {`${category._count.tools} ${plur("tool", category._count.tools)}`}
        </CardSimpleCaption>
      </Link>
    </CardSimple>
  )
}

const CategoryCardSkeleton = () => {
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

export { CategoryCard, CategoryCardSkeleton }

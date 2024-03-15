import { Card } from "~/components/Card"
import { ComponentPropsWithoutRef } from "react"
import { Category } from "~/queries/categories"

type CategoryCardProps = Omit<ComponentPropsWithoutRef<typeof Card>, "href"> & {
  category: Partial<Category>
}

export const CategoryCard = ({ category, ...props }: CategoryCardProps) => {
  const count = category.tools?.length || 0

  return (
    <Card href={`/category/${category.slug}`} {...props}>
      <div className="flex w-full items-center justify-between gap-3">
        <h2 className="flex-1 truncate text-lg font-semibold">{category.name}</h2>
        <strong className="mr-0.5 text-gray-400">{count}</strong>
      </div>
    </Card>
  )
}

import type { SerializeFrom } from "@remix-run/node"
import { CardSimple } from "apps/web/app/components/CardSimple"
import type { CategoryMany } from "apps/web/app/services.server/api"
import plur from "plur"
import type { HTMLAttributes } from "react"

type CategoryRecordProps = HTMLAttributes<HTMLElement> & {
  category: SerializeFrom<CategoryMany>
}

export const CategoryRecord = ({ category, ...props }: CategoryRecordProps) => {
  return (
    <CardSimple
      to={`/categories/${category.slug}`}
      label={category.name}
      caption={`${category._count.tools} ${plur("tool", category._count.tools)}`}
      {...props}
    />
  )
}

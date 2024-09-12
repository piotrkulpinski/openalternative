import type { SerializeFrom } from "@remix-run/node"
import plur from "plur"
import type { HTMLAttributes } from "react"
import { CardSimple } from "~/components/ui/card-simple"
import type { CategoryMany } from "~/services.server/api"

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

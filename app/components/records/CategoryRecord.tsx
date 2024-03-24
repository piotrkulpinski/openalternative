import { HTMLAttributes } from "react"
import plur from "plur"
import { CategoryMany } from "~/services.server/api"
import { CardSimple } from "~/components/CardSimple"
import { SerializeFrom } from "@remix-run/node"

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

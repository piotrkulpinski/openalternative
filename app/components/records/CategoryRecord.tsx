import { HTMLAttributes } from "react"
import { CategoryMany } from "~/services.server/api"
import { CardSimple } from "../CardSimple"

type CategoryRecordProps = HTMLAttributes<HTMLElement> & {
  category: CategoryMany
}

export const CategoryRecord = ({ category, ...props }: CategoryRecordProps) => {
  return (
    <CardSimple
      to={`/categories/${category.slug}`}
      label={category.name}
      caption={`${category.tools.length} tools`}
      {...props}
    />
  )
}

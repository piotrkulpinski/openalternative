import type { SerializeFrom } from "@remix-run/node"
import type { HTMLAttributes } from "react"
import { Container } from "~/components/Container"
import { H6 } from "~/components/Heading"
import { NavigationLink } from "~/components/NavigationLink"
import { Series } from "~/components/Series"
import type { AlternativeMany, CategoryMany } from "~/services.server/api"
import { cx } from "~/utils/cva"

type BottomProps = HTMLAttributes<HTMLElement> & {
  categories?: SerializeFrom<CategoryMany>[]
  alternatives?: SerializeFrom<AlternativeMany>[]
}

export const Bottom = ({
  children,
  className,
  categories,
  alternatives,
  ...props
}: BottomProps) => {
  return (
    <Container>
      <div
        className={cx(
          "flex flex-col gap-y-6 py-8 border-t border-muted/15 md:pt-10 lg:pt-12",
          className,
        )}
        {...props}
      >
        {!!alternatives?.length && (
          <Series className="gap-x-4 text-sm/normal">
            <H6 as="strong">Popular Proprietary Tools:</H6>

            <div className="grid grid-auto-fill-xs gap-x-4 gap-y-2 w-full">
              {alternatives.map(alternative => (
                <NavigationLink key={alternative.id} to={`/alternatives/${alternative.slug}`}>
                  <span className="truncate">{alternative.name} Alternatives</span>
                  <hr className="min-w-2 flex-1" />
                  <span className="shrink-0 text-xs">{alternative._count.tools}</span>
                </NavigationLink>
              ))}
            </div>
          </Series>
        )}

        {!!categories?.length && (
          <Series className="gap-x-4 text-sm/normal md:flex-col md:items-start md:col-span-3">
            <H6 as="strong">Popular Categories:</H6>

            <div className="grid grid-auto-fill-xs gap-x-4 gap-y-2 w-full">
              {categories.map(category => (
                <NavigationLink key={category.id} to={`/categories/${category.slug}`}>
                  <span className="truncate">{category.label}</span>{" "}
                  <hr className="min-w-2 flex-1" />
                  <span className="shrink-0 text-xs">{category._count.tools}</span>
                </NavigationLink>
              ))}
            </div>
          </Series>
        )}
      </div>
    </Container>
  )
}
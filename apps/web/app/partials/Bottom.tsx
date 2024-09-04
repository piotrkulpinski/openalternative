import type { SerializeFrom } from "@remix-run/node"
import { Container } from "apps/web/app/components/Container"
import { H6 } from "apps/web/app/components/Heading"
import { NavigationLink } from "apps/web/app/components/NavigationLink"
import { Series } from "apps/web/app/components/Series"
import type { AlternativeMany, CategoryMany } from "apps/web/app/services.server/api"
import { cx } from "apps/web/app/utils/cva"
import type { HTMLAttributes } from "react"

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
          "flex flex-col gap-y-6 py-8 border-t border-muted/15 md:py-10 lg:py-12",
          className,
        )}
        {...props}
      >
        {!!alternatives?.length && (
          <Series className="gap-x-4 text-sm/normal">
            <H6 as="strong">Popular Proprietary Tools:</H6>

            <div className="grid grid-auto-fill-xxs gap-x-4 gap-y-2 w-full sm:grid-auto-fill-xs">
              {alternatives.map(alternative => (
                <NavigationLink key={alternative.id} to={`/alternatives/${alternative.slug}`}>
                  <span className="truncate">{alternative.name} Alternatives</span>
                  <hr className="min-w-2 flex-1" />
                  <span className="shrink-0 text-xs max-sm:hidden">{alternative._count.tools}</span>
                </NavigationLink>
              ))}
            </div>
          </Series>
        )}

        {!!categories?.length && (
          <Series className="gap-x-4 text-sm/normal md:flex-col md:items-start md:col-span-3">
            <H6 as="strong">Popular Categories:</H6>

            <div className="grid grid-auto-fill-xxs gap-x-4 gap-y-2 w-full sm:grid-auto-fill-xs">
              {categories.map(category => (
                <NavigationLink key={category.id} to={`/categories/${category.slug}`}>
                  <span className="truncate">{category.label}</span>{" "}
                  <hr className="min-w-2 flex-1" />
                  <span className="shrink-0 text-xs max-sm:hidden">{category._count.tools}</span>
                </NavigationLink>
              ))}
            </div>
          </Series>
        )}
      </div>
    </Container>
  )
}

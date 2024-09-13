import type { SerializeFrom } from "@remix-run/node"
import type { HTMLAttributes } from "react"
import { Container } from "~/components/ui/container"
import { H6 } from "~/components/ui/heading"
import { NavigationLink } from "~/components/ui/navigation-link"
import { Stack } from "~/components/ui/stack"
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
          "flex flex-col gap-y-6 py-8 border-t border-muted/15 md:py-10 lg:py-12",
          className,
        )}
        {...props}
      >
        {!!alternatives?.length && (
          <Stack className="gap-x-4 text-sm/normal">
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
          </Stack>
        )}

        {!!categories?.length && (
          <Stack className="gap-x-4 text-sm/normal md:flex-col md:items-start md:col-span-3">
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
          </Stack>
        )}
      </div>
    </Container>
  )
}

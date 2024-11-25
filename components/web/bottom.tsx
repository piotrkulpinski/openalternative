import type { ComponentProps } from "react"
import { H6 } from "~/components/common/heading"
import { Stack } from "~/components/common/stack"
import { Container } from "~/components/web/ui/container"
import { NavigationLink } from "~/components/web/ui/navigation-link"
import { findAlternatives } from "~/server/alternatives/queries"
import { findCategories } from "~/server/categories/queries"
import { cx } from "~/utils/cva"

export const Bottom = async ({ className, ...props }: ComponentProps<"div">) => {
  const [categories, alternatives] = await Promise.all([
    findCategories({
      orderBy: { tools: { _count: "desc" } },
      take: 12,
    }),

    findAlternatives({
      where: { website: { startsWith: "https://go" } },
      orderBy: { tools: { _count: "desc" } },
      take: 12,
    }),
  ])

  if (!categories?.length && !alternatives?.length) {
    return null
  }

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

            <div className="grid grid-cols-2xs gap-x-4 gap-y-2 w-full sm:grid-cols-xs">
              {alternatives.map(alternative => (
                <NavigationLink key={alternative.id} href={`/alternatives/${alternative.slug}`}>
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

            <div className="grid grid-cols-2xs gap-x-4 gap-y-2 w-full sm:grid-cols-xs">
              {categories.map(category => (
                <NavigationLink key={category.id} href={`/categories/${category.slug}`}>
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

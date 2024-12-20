import type { ComponentProps } from "react"
import { H6 } from "~/components/common/heading"
import { Stack } from "~/components/common/stack"
import { CardSimple, CardSimpleCaption, CardSimpleDivider } from "~/components/web/ui/card-simple"
import { Container } from "~/components/web/ui/container"
import { NavLink } from "~/components/web/ui/nav-link"
import { siteConfig } from "~/config/site"
import { findAlternatives } from "~/server/web/alternatives/queries"
import { findCategories } from "~/server/web/categories/queries"
import { cx } from "~/utils/cva"

export const Bottom = async ({ className, ...props }: ComponentProps<"div">) => {
  const [categories, alternatives] = await Promise.all([
    findCategories({
      orderBy: { tools: { _count: "desc" } },
      take: 12,
    }),

    findAlternatives({
      where: { website: { startsWith: siteConfig.affiliateUrl } },
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
          "flex flex-col gap-y-6 py-8 border-t border-foreground/10 md:py-10 lg:py-12",
          className,
        )}
        {...props}
      >
        {!!alternatives?.length && (
          <Stack className="gap-x-4 text-sm/normal">
            <H6 as="strong">Popular Proprietary Tools:</H6>

            <div className="grid grid-cols-2xs gap-x-4 gap-y-2 w-full sm:grid-cols-xs">
              {alternatives.map(alternative => (
                <CardSimple key={alternative.slug} className="gap-2" asChild>
                  <NavLink href={`/alternatives/${alternative.slug}`}>
                    <span className="truncate">{alternative.name} Alternatives</span>

                    <CardSimpleDivider />

                    <CardSimpleCaption className="max-sm:hidden">
                      {alternative._count.tools}
                    </CardSimpleCaption>
                  </NavLink>
                </CardSimple>
              ))}
            </div>
          </Stack>
        )}

        {!!categories?.length && (
          <Stack className="gap-x-4 text-sm/normal">
            <H6 as="strong">Popular Categories:</H6>

            <div className="grid grid-cols-2xs gap-x-4 gap-y-2 w-full sm:grid-cols-xs">
              {categories.map(category => (
                <CardSimple key={category.slug} className="gap-2" asChild>
                  <NavLink href={`/categories/${category.slug}`}>
                    <span className="truncate">{category.label}</span>

                    <CardSimpleDivider />

                    <CardSimpleCaption className="max-sm:hidden">
                      {category._count.tools}
                    </CardSimpleCaption>
                  </NavLink>
                </CardSimple>
              ))}
            </div>
          </Stack>
        )}
      </div>
    </Container>
  )
}

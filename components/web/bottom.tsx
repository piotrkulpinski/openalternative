import type { ComponentProps } from "react"
import { H6 } from "~/components/common/heading"
import { Stack } from "~/components/common/stack"
import { Container } from "~/components/web/ui/container"
import { NavLink } from "~/components/web/ui/nav-link"
import { Tile, TileCaption, TileDivider } from "~/components/web/ui/tile"
import { siteConfig } from "~/config/site"
import { findAlternatives } from "~/server/web/alternatives/queries"
import { cx } from "~/utils/cva"

export const Bottom = async ({ className, ...props }: ComponentProps<"div">) => {
  const alternatives = await findAlternatives({
    where: { websiteUrl: { startsWith: siteConfig.affiliateUrl } },
    orderBy: { tools: { _count: "desc" } },
    take: 12,
  })

  if (!alternatives?.length) {
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
                <Tile key={alternative.slug} className="gap-2" asChild>
                  <NavLink href={`/alternatives/${alternative.slug}`}>
                    <span className="truncate">{alternative.name} Alternatives</span>

                    <TileDivider />

                    <TileCaption className="max-sm:hidden">{alternative._count.tools}</TileCaption>
                  </NavLink>
                </Tile>
              ))}
            </div>
          </Stack>
        )}
      </div>
    </Container>
  )
}

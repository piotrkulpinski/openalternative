import { ToolStatus } from "@openalternative/db/client"
import Link from "next/link"
import { Listing } from "~/components/web/listing"
import { Grid } from "~/components/web/ui/grid"
import { Tile } from "~/components/web/ui/tile"
import { findCategories } from "~/server/web/categories/queries"

const SelfHostedCategories = async () => {
  const categories = await findCategories({
    where: {
      tools: {
        some: {
          status: ToolStatus.Published,
          isSelfHosted: true,
        },
      },
    },
  })

  if (!categories.length) {
    return null
  }

  return (
    <Listing title="Browse categories of self-hosted tools:" separated>
      <Grid className="gap-y-3 mt-4">
        {categories.map(category => (
          <Tile key={category.slug} asChild>
            <Link href={`/categories/${category.slug}/self-hosted`}>
              <h6 className="text-muted-foreground text-sm truncate group-hover:text-foreground">
                Self-hosted {category.label}
              </h6>
            </Link>
          </Tile>
        ))}
      </Grid>
    </Listing>
  )
}

export { SelfHostedCategories }

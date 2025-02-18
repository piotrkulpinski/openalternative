import { ToolStatus } from "@openalternative/db/client"
import Link from "next/link"
import { Listing } from "~/components/web/listing"
import { Grid } from "~/components/web/ui/grid"
import { Tile } from "~/components/web/ui/tile"
import { findCategories } from "~/server/web/categories/queries"
import type { StackOne } from "~/server/web/stacks/payloads"

type StackCategoriesProps = {
  stack: StackOne
}

const StackCategories = async ({ stack }: StackCategoriesProps) => {
  const categories = await findCategories({
    where: {
      tools: {
        some: {
          status: ToolStatus.Published,
          stacks: { some: { slug: stack.slug } },
        },
      },
    },
  })

  if (!categories.length) {
    return null
  }

  return (
    <Listing title={`Browse categories of tools using ${stack.name}:`} separated>
      <Grid className="gap-y-3 mt-4">
        {categories.map(category => (
          <Tile key={category.slug} asChild>
            <Link href={`/categories/${category.slug}/using/${stack.slug}`}>
              <h6 className="text-muted-foreground text-sm truncate group-hover:text-foreground">
                Best {category.label} using {stack.name}
              </h6>
            </Link>
          </Tile>
        ))}
      </Grid>
    </Listing>
  )
}

export { StackCategories }

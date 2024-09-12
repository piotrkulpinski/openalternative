import type { SerializeFrom } from "@remix-run/node"
import { Link } from "@remix-run/react"
import { ArrowRightIcon } from "lucide-react"
import type { HTMLAttributes } from "react"
import { AlternativeRecord } from "~/components/records/alternative-record"
import { Button } from "~/components/ui/button"
import { Grid } from "~/components/ui/grid"
import { H4 } from "~/components/ui/heading"
import { Series } from "~/components/ui/series"
import type { AlternativeMany } from "~/services.server/api"

type AlternativeListProps = HTMLAttributes<HTMLDivElement> & {
  alternatives: SerializeFrom<AlternativeMany>[]
}

export const AlternativeList = ({ className, alternatives, ...props }: AlternativeListProps) => {
  if (!alternatives.length) {
    return null
  }

  return (
    <>
      <hr />

      <Series size="lg" direction="column">
        <Series className="w-full justify-between">
          <H4 as="h3">Discover Open Source alternatives to:</H4>

          <Button size="md" variant="secondary" suffix={<ArrowRightIcon />} asChild>
            <Link to="/alternatives">View all alternatives</Link>
          </Button>
        </Series>

        <Grid className="w-full">
          {alternatives?.map(alternative => (
            <AlternativeRecord key={alternative.id} alternative={alternative} showCount />
          ))}
        </Grid>
      </Series>
    </>
  )
}

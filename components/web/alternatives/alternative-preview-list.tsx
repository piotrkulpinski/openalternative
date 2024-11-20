import { ArrowRightIcon } from "lucide-react"
import Link from "next/link"
import { H4 } from "~/components/common/heading"
import { Stack } from "~/components/common/stack"
import { AlternativeCard } from "~/components/web/alternatives/alternative-card"
import { Button } from "~/components/web/ui/button"
import { Grid } from "~/components/web/ui/grid"
import { alternativeManyPayload } from "~/server/alternatives/payloads"
import { findAlternatives } from "~/server/alternatives/queries"

const AlternativePreviewList = async () => {
  const list = [
    "keap",
    "monday",
    "notion",
    "airtable",
    "typeform",
    "teamwork",
    "todoist",
    "kissmetrics",
    "fathom-analytics",
  ]

  const alternatives = await findAlternatives({
    where: { slug: { in: list } },
    include: alternativeManyPayload,
    take: 6,
  })

  if (!alternatives.length) {
    return null
  }

  return (
    <>
      <hr />

      <Stack size="lg" direction="column">
        <Stack className="w-full justify-between">
          <H4 as="h3">Discover Open Source alternatives to:</H4>

          <Button size="md" variant="secondary" suffix={<ArrowRightIcon />} asChild>
            <Link href="/alternatives">View all alternatives</Link>
          </Button>
        </Stack>

        <Grid className="w-full">
          {alternatives.map(alternative => (
            <AlternativeCard key={alternative.id} alternative={alternative} showCount />
          ))}
        </Grid>
      </Stack>
    </>
  )
}

export { AlternativePreviewList }

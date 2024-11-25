import Link from "next/link"
import type { SearchParams } from "nuqs"
import { Suspense } from "react"
import { CountBadge, CountBadgeSkeleton } from "~/app/(web)/(home)/count-badge"
import { Stack } from "~/components/common/stack"
import { AlternativePreviewList } from "~/components/web/alternatives/alternative-preview-list"
import { Newsletter } from "~/components/web/newsletter"
import { NewsletterProof } from "~/components/web/newsletter-proof"
import { ToolListSkeleton } from "~/components/web/tools/tool-list"
import { ToolListing } from "~/components/web/tools/tool-listing"
import { Button } from "~/components/web/ui/button"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { config } from "~/config"

type PageProps = {
  searchParams: Promise<SearchParams>
}

export default function Home({ searchParams }: PageProps) {
  const hideNewsletter = false

  return (
    <>
      <section className="flex flex-col gap-y-6 w-full mb-[2vh]">
        <Intro alignment="center">
          <IntroTitle className="max-w-[45rem] lg:text-5xl!">
            Discover {config.site.tagline}
          </IntroTitle>

          <IntroDescription className="lg:mt-2">{config.site.description}</IntroDescription>

          <Suspense fallback={<CountBadgeSkeleton />}>
            <CountBadge />
          </Suspense>
        </Intro>

        {hideNewsletter ? (
          <Stack className="mx-auto place-content-center">
            <Button variant="secondary" asChild>
              <Link href="/alternatives">Browse by Alternatives</Link>
            </Button>

            <Button variant="secondary" asChild>
              <Link href="/submit">Submit a Tool</Link>
            </Button>
          </Stack>
        ) : (
          <Newsletter
            size="lg"
            className="w-full mx-auto items-center text-center"
            buttonProps={{ children: "Join our community", size: "md", variant: "fancy" }}
          >
            <NewsletterProof />
          </Newsletter>
        )}
      </section>

      <Suspense fallback={<ToolListSkeleton />}>
        <ToolListing searchParams={searchParams} />
      </Suspense>

      <AlternativePreviewList />
    </>
  )
}

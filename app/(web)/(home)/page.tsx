import Image from "next/image"
import type { SearchParams } from "nuqs/server"
import { Suspense } from "react"
import { CountBadge, CountBadgeSkeleton } from "~/app/(web)/(home)/count-badge"
import { AlternativePreviewSkeleton } from "~/components/web/alternatives/alternative-preview"
import { AlternativePreview } from "~/components/web/alternatives/alternative-preview"
import { NewsletterForm } from "~/components/web/newsletter-form"
import { NewsletterProof } from "~/components/web/newsletter-proof"
import { ToolListingSkeleton } from "~/components/web/tools/tool-listing"
import { ToolQuery } from "~/components/web/tools/tool-query"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { config } from "~/config"

type PageProps = {
  searchParams: Promise<SearchParams>
}

export default function Home(props: PageProps) {
  return (
    <>
      <section className="relative flex flex-col justify-center gap-y-6 pb-8 md:pb-10 lg:pb-12 lg:min-h-fit lg:h-[30vw] lg:max-h-100">
        <div className="absolute left-1/2 bottom-0 -z-10 w-dvw h-2/3 border-b bg-gradient-to-t from-card to-transparent -translate-x-1/2 select-none overflow-clip dark:from-background/95 dark:border-card-dark">
          <Image
            src="/contribution-graph.webp"
            alt=""
            width={753}
            height={104}
            className="size-full object-cover blur-[2px] mask-t-from-0% opacity-10 translate-y-3 dark:invert"
            loading="lazy"
          />
        </div>

        <Intro alignment="center">
          <IntroTitle className="max-w-[15em] sm:text-4xl md:text-5xl lg:text-6xl">
            Discover {config.site.tagline}
          </IntroTitle>

          <IntroDescription className="lg:mt-2">{config.site.description}</IntroDescription>

          <Suspense fallback={<CountBadgeSkeleton />}>
            <CountBadge />
          </Suspense>
        </Intro>

        <NewsletterForm
          size="lg"
          className="max-w-sm mx-auto items-center text-center"
          buttonProps={{ children: "Join our community", size: "md", variant: "fancy" }}
        >
          <NewsletterProof />
        </NewsletterForm>
      </section>

      <Suspense fallback={<ToolListingSkeleton />}>
        <ToolQuery searchParams={props.searchParams} options={{ enableFilters: true }} />
      </Suspense>

      <Suspense fallback={<AlternativePreviewSkeleton />}>
        <AlternativePreview />
      </Suspense>
    </>
  )
}

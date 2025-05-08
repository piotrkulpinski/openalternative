import type { Metadata } from "next"
import type { SearchParams } from "nuqs/server"
import { Suspense } from "react"
import { SelfHostedCategories } from "~/app/(web)/self-hosted/categories"
import { ToolListingSkeleton } from "~/components/web/tools/tool-listing"
import { ToolQuery } from "~/components/web/tools/tool-query"
import { Breadcrumbs } from "~/components/web/ui/breadcrumbs"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { metadataConfig } from "~/config/metadata"

type PageProps = {
  searchParams: Promise<SearchParams>
}

export const metadata: Metadata = {
  title: "Self-hosted Alternatives to Popular Software",
  description:
    "Self-hosting involves running and managing applications on your own server(s) rather than utilizing SaaS providers. Below is a list of services and web applications that can be hosted on your own server(s).",
  openGraph: { ...metadataConfig.openGraph, url: "/self-hosted" },
  alternates: { ...metadataConfig.alternates, canonical: "/self-hosted" },
}

export default async function SelfHostedPage(props: PageProps) {
  return (
    <>
      <Breadcrumbs
        items={[
          {
            href: "/self-hosted",
            name: "Self-Hosted Tools",
          },
        ]}
      />

      <Intro>
        <IntroTitle>{`Browse ${metadata.title}`}</IntroTitle>
        <IntroDescription>{metadata.description}</IntroDescription>
      </Intro>

      <Suspense fallback={<ToolListingSkeleton />}>
        <ToolQuery
          searchParams={props.searchParams}
          where={{ isSelfHosted: true }}
          search={{ placeholder: "Search self-hosted tools..." }}
          options={{ enableFilters: true }}
        />
      </Suspense>

      <Suspense>
        <SelfHostedCategories />
      </Suspense>
    </>
  )
}

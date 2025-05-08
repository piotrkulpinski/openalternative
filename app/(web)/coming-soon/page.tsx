import { ToolStatus } from "@prisma/client"
import type { Metadata } from "next"
import type { SearchParams } from "nuqs/server"
import { Suspense } from "react"
import { ToolListingSkeleton } from "~/components/web/tools/tool-listing"
import { ToolQuery } from "~/components/web/tools/tool-query"
import { Breadcrumbs } from "~/components/web/ui/breadcrumbs"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { config } from "~/config"
import { metadataConfig } from "~/config/metadata"

type PageProps = {
  searchParams: Promise<SearchParams>
}

export const metadata: Metadata = {
  title: "Open Source alternatives coming soon!",
  description: `Below is a list of open source tools that are scheduled to be published on ${config.site.name} soon. They are not visible anywhere else on the site.`,
  openGraph: { ...metadataConfig.openGraph, url: "/coming-soon" },
  alternates: { ...metadataConfig.alternates, canonical: "/coming-soon" },
}

export default async function ComingSoonPage(props: PageProps) {
  return (
    <>
      <Breadcrumbs
        items={[
          {
            href: "/coming-soon",
            name: "Coming Soon",
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
          overrideParams={{ sort: "publishedAt.asc" }}
          where={{ status: ToolStatus.Scheduled }}
          search={{ placeholder: "Search scheduled tools..." }}
          options={{ enableSort: false }}
        />
      </Suspense>
    </>
  )
}

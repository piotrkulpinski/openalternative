import type { Metadata } from "next"
import { notFound } from "next/navigation"
import type { SearchParams } from "nuqs/server"
import { Suspense, cache } from "react"
import { LicenseToolListing } from "~/app/(web)/licenses/[slug]/listing"
import { H2 } from "~/components/common/heading"
import { AdCard, AdCardSkeleton } from "~/components/web/ads/ad-card"
import { Listing } from "~/components/web/listing"
import { Markdown } from "~/components/web/markdown"
import { ToolListSkeleton } from "~/components/web/tools/tool-list"
import { BackButton } from "~/components/web/ui/back-button"
import { Breadcrumbs } from "~/components/web/ui/breadcrumbs"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { Section } from "~/components/web/ui/section"
import { metadataConfig } from "~/config/metadata"
import type { LicenseOne } from "~/server/web/licenses/payloads"
import { findLicense, findLicenseSlugs } from "~/server/web/licenses/queries"

type PageProps = {
  params: Promise<{ slug: string }>
  searchParams: Promise<SearchParams>
}

const getLicense = cache(async ({ params }: PageProps) => {
  const { slug } = await params
  const license = await findLicense({ where: { slug } })

  if (!license) {
    notFound()
  }

  return license
})

const getMetadata = (license: LicenseOne): Metadata => {
  return {
    title: `The ${license.name} License Explained: Pros, Cons, and Use Cases`,
    description: license.description,
  }
}

export const generateStaticParams = async () => {
  const licenses = await findLicenseSlugs({})
  return licenses.map(({ slug }) => ({ slug }))
}

export const generateMetadata = async (props: PageProps): Promise<Metadata> => {
  const license = await getLicense(props)
  const url = `/licenses/${license.slug}`

  return {
    ...getMetadata(license),
    alternates: { ...metadataConfig.alternates, canonical: url },
    openGraph: { ...metadataConfig.openGraph, url },
  }
}

export default async function LicensePage(props: PageProps) {
  const license = await getLicense(props)
  const { title, description } = getMetadata(license)

  return (
    <>
      <Breadcrumbs
        items={[
          {
            href: "/licenses",
            name: "Licenses",
          },
          {
            href: `/licenses/${license.slug}`,
            name: license.name,
          },
        ]}
      />

      <Intro>
        <IntroTitle>{`${title}`}</IntroTitle>
        <IntroDescription className="max-w-3xl">{description}</IntroDescription>
      </Intro>

      <Section>
        <Section.Content>
          {license.content && <Markdown code={license.content} />}

          <BackButton href="/licenses" />
        </Section.Content>

        <Section.Sidebar>
          <Suspense
            fallback={
              <Listing title="Best examples:">
                <ToolListSkeleton count={2} />
              </Listing>
            }
          >
            <LicenseToolListing license={license} count={2} />
          </Suspense>

          <hr />

          <Suspense fallback={<AdCardSkeleton className="max-md:hidden" />}>
            <AdCard type="BlogPost" className="max-md:hidden" />
          </Suspense>
        </Section.Sidebar>
      </Section>
    </>
  )
}

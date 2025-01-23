import type { Metadata } from "next"
import { notFound } from "next/navigation"
import type { SearchParams } from "nuqs/server"
import { Suspense, cache } from "react"
import { LicenseToolListing } from "~/app/(web)/licenses/[slug]/listing"
import { H2 } from "~/components/common/heading"
import { Listing } from "~/components/web/listing"
import { Markdown } from "~/components/web/markdown"
import { ToolListSkeleton } from "~/components/web/tools/tool-list"
import { BackButton } from "~/components/web/ui/back-button"
import { Breadcrumbs } from "~/components/web/ui/breadcrumbs"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { Section } from "~/components/web/ui/section"
import { metadataConfig } from "~/config/metadata"
import type { LicenseOne } from "~/server/web/licenses/payloads"
import { findLicenseBySlug, findLicenseSlugs } from "~/server/web/licenses/queries"

type PageProps = {
  params: Promise<{ slug: string }>
  searchParams: Promise<SearchParams>
}

const getLicense = cache(async ({ params }: PageProps) => {
  const { slug } = await params
  const license = await findLicenseBySlug(slug)

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

      <Suspense
        fallback={
          <Listing title={`${license.name} Licensed Software Examples`}>
            <ToolListSkeleton count={3} />
          </Listing>
        }
      >
        <LicenseToolListing license={license} />
      </Suspense>

      {license.content && (
        <Section>
          <Section.Content>
            <H2>What is {license.name} License?</H2>
            <Markdown code={license.content} />
          </Section.Content>
        </Section>
      )}

      <BackButton href="/licenses" />
    </>
  )
}

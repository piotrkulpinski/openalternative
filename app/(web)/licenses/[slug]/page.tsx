import type { Metadata } from "next"
import { notFound } from "next/navigation"
import type { SearchParams } from "nuqs/server"
import { Suspense, cache } from "react"
import { LicenseToolListing } from "~/app/(web)/licenses/[slug]/listing"
import { ToolQuerySkeleton } from "~/components/web/tools/tool-query"
import { Breadcrumbs } from "~/components/web/ui/breadcrumbs"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
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
    title: `${license.name} Licensed Open Source Software`,
    description: `A curated collection of the ${license._count.tools} best open source software licensed under ${license.name}.`,
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

      <Suspense fallback={<ToolQuerySkeleton />}>
        <LicenseToolListing license={license} searchParams={props.searchParams} />
      </Suspense>
    </>
  )
}

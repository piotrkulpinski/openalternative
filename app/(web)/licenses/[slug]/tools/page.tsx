import type { Metadata } from "next"
import { notFound } from "next/navigation"
import type { SearchParams } from "nuqs"
import { Suspense, cache } from "react"
import { LicenseToolListing } from "~/app/(web)/licenses/[slug]/tools/listing"
import { ToolQuerySkeleton } from "~/components/web/tools/tool-query"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { metadataConfig } from "~/config/metadata"
import type { LicenseOne } from "~/server/licenses/payloads"
import { findLicense, findLicenseSlugs } from "~/server/licenses/queries"

export const revalidate = 86400 // 24 hours

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
    description: `A curated collection of the ${license._count.tools} best open source software licensed under ${license.name}. Find the best tools, libraries, and frameworks for your next project.`,
  }
}

export const generateStaticParams = async () => {
  const licenses = await findLicenseSlugs({})
  return licenses.map(({ slug }) => ({ slug }))
}

export const generateMetadata = async (props: PageProps): Promise<Metadata> => {
  const license = await getLicense(props)
  const url = `/licenses/${license.slug}/tools`

  return {
    ...getMetadata(license),
    alternates: { ...metadataConfig.alternates, canonical: url },
    openGraph: { ...metadataConfig.openGraph, url },
  }
}

export default async function LicenseToolsPage(props: PageProps) {
  const license = await getLicense(props)
  const { title, description } = getMetadata(license)

  return (
    <>
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

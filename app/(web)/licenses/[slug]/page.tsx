import type { Metadata } from "next"
import { notFound } from "next/navigation"
import type { SearchParams } from "nuqs/server"
import { Suspense, cache } from "react"
import { LicenseToolListing } from "~/app/(web)/licenses/[slug]/listing"
import { H2 } from "~/components/common/heading"
import { Markdown } from "~/components/common/markdown"
import { ToolListSkeleton } from "~/components/web/tools/tool-list"
import { BackButton } from "~/components/web/ui/back-button"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { Section } from "~/components/web/ui/section"
import type { LicenseOne } from "~/server/licenses/payloads"
import { findLicense, findLicenseSlugs } from "~/server/licenses/queries"
import { parseMetadata } from "~/utils/metadata"

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

const getMetadata = (license: LicenseOne) => {
  return {
    title: `The ${license.name} License Explained: Pros, Cons, and Use Cases`,
    description: license.description,
  } satisfies Metadata
}

export const generateStaticParams = async () => {
  const licenses = await findLicenseSlugs({})
  return licenses.map(({ slug }) => ({ slug }))
}

export const generateMetadata = async (props: PageProps) => {
  const license = await getLicense(props)
  const url = `/licenses/${license.slug}`

  return parseMetadata(
    Object.assign(getMetadata(license), {
      alternates: { canonical: url },
      openGraph: { url },
    }),
  )
}

export default async function LicensePage(props: PageProps) {
  const license = await getLicense(props)
  const { title, description } = getMetadata(license)

  return (
    <>
      <Intro>
        <IntroTitle>{title}</IntroTitle>
        <IntroDescription className="max-w-3xl">{description}</IntroDescription>
      </Intro>

      <Suspense fallback={<ToolListSkeleton count={3} />}>
        <LicenseToolListing
          license={license}
          where={{ license: { slug: license.slug } }}
          take={3}
        />
      </Suspense>

      {license.content && (
        <Section>
          <Section.Content>
            <H2>What is {license.name} License?</H2>
            <Markdown>{license.content}</Markdown>
          </Section.Content>
        </Section>
      )}

      <BackButton href="/licenses" />
    </>
  )
}

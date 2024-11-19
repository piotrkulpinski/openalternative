import type { Metadata } from "next"
import Link from "next/link"
import { cache } from "react"
import { SubmitForm } from "~/app/(web)/submit/form"
import { Prose } from "~/components/common/prose"
import { Card } from "~/components/web/ui/card"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { Section } from "~/components/web/ui/section"
import { config } from "~/config"
import { parseMetadata } from "~/utils/metadata"

const getMetadata = cache(
  (metadata?: Metadata): Metadata => ({
    ...metadata,
    title: "Submit your Open Source Software",
    description: `Help us grow the list of open source alternatives to proprietary software. Contribute to ${config.site.name} by submitting a new open source alternative.`,
  }),
)

export const metadata = parseMetadata(
  getMetadata({
    alternates: { canonical: "/submit" },
    openGraph: { url: "/submit" },
  }),
)

export default function SubmitPage() {
  const { title, description } = getMetadata()

  return (
    <>
      <Intro>
        <IntroTitle>{title?.toString()}</IntroTitle>
        <IntroDescription>{description}</IntroDescription>
      </Intro>

      <Section>
        <Section.Content>
          <SubmitForm />
        </Section.Content>

        <Section.Sidebar>
          <Card hover={false}>
            <Prose className="text-sm/normal">
              <p>
                <strong>Note:</strong> Submission alone does not guarantee a feature. Please make
                sure the software you're submitting is:
              </p>

              <ul className="[&_li]:p-0 list-inside p-0">
                <li>Open source</li>
                <li>Free to use or can be self-hosted</li>
                <li>Actively maintained</li>
                <li>
                  An <Link href="/alternatives">alternative to popular software</Link>
                </li>
              </ul>
            </Prose>
          </Card>
        </Section.Sidebar>
      </Section>
    </>
  )
}

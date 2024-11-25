import type { Metadata } from "next"
import Link from "next/link"
import { SubmitForm } from "~/app/(web)/submit/form"
import { Card } from "~/components/web/ui/card"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { Prose } from "~/components/web/ui/prose"
import { Section } from "~/components/web/ui/section"
import { config } from "~/config"
import { parseMetadata } from "~/utils/metadata"

const metadata = {
  title: "Submit your Open Source Software",
  description: `Help us grow the list of open source alternatives to proprietary software. Contribute to ${config.site.name} by submitting a new open source alternative.`,
} satisfies Metadata

export const generateMetadata = () => {
  return parseMetadata({
    ...metadata,
    alternates: { canonical: "/submit" },
    openGraph: { url: "/submit" },
  })
}

export default function SubmitPage() {
  return (
    <>
      <Intro>
        <IntroTitle>{metadata.title}</IntroTitle>
        <IntroDescription>{metadata.description}</IntroDescription>
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

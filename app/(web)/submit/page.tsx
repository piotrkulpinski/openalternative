import type { Metadata } from "next"
import { SubmitForm } from "~/app/(web)/submit/form"
import { Link } from "~/components/common/link"
import { Prose } from "~/components/common/prose"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { Section } from "~/components/web/ui/section"
import { config } from "~/config"
import { metadataConfig } from "~/config/metadata"

export const metadata: Metadata = {
  title: "Submit your Open Source Software",
  description: `Help us grow the list of open source alternatives to proprietary software. Contribute to ${config.site.name} by submitting a new open source alternative.`,
  openGraph: { ...metadataConfig.openGraph, url: "/submit" },
  alternates: { ...metadataConfig.alternates, canonical: "/submit" },
}

export default async function SubmitPage() {
  return (
    <>
      <Intro>
        <IntroTitle>{`${metadata.title}`}</IntroTitle>
        <IntroDescription>{metadata.description}</IntroDescription>
      </Intro>

      <Section>
        <Section.Content>
          <SubmitForm />
        </Section.Content>

        <Section.Sidebar>
          <Prose className="text-sm/normal">
            <p>
              <strong>Note:</strong> Submission alone does not guarantee a feature. We review
              submissions to ensure they meet the following criteria:
            </p>

            <ul className="[&_li]:p-0 list-inside p-0">
              <li>The project is Open Source</li>
              <li>The project is actively maintained</li>
              <li>
                It is an <Link href="/alternatives">alternative to proprietary software</Link>
              </li>
            </ul>
          </Prose>
        </Section.Sidebar>
      </Section>
    </>
  )
}

import type { Metadata } from "next"
import Image from "next/image"
import type { SearchParams } from "nuqs/server"
import { Link } from "~/components/common/link"
import { Stack } from "~/components/common/stack"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { config } from "~/config"
import { metadataConfig } from "~/config/metadata"

type PageProps = {
  searchParams: Promise<SearchParams>
}

export const metadata: Metadata = {
  title: "Check your inbox",
  description: `Check your inbox to sign in to ${config.site.name}.`,
  openGraph: { ...metadataConfig.openGraph, url: "/check-inbox" },
  alternates: { ...metadataConfig.alternates, canonical: "/check-inbox" },
}

export default async function VerifyPage({ searchParams }: PageProps) {
  const { email } = await searchParams

  const inboxes = [
    {
      provider: "Outlook",
      icon: "/outlook.svg",
      link: "ms-outlook://",
    },
    {
      provider: "Gmail",
      icon: "/gmail.svg",
      link: "https://mail.google.com/#search/openalternative%20login",
    },
    {
      provider: "Superhuman",
      icon: "/superhuman.svg",
      link: "superhuman://mail.superhuman.com/search/openalternative%20login",
    },
  ]

  return (
    <>
      <Intro>
        <IntroTitle size="h3">{`${metadata.title}`}</IntroTitle>
        <IntroDescription className="md:text-sm">
          We've sent you a magic link to <strong className="text-foreground">{email}</strong>.
          Please click the link to confirm your address.
        </IntroDescription>
      </Intro>

      <Stack size="lg" className="my-3">
        {inboxes.map(({ provider, icon, link }) => (
          <a
            key={provider}
            href={link}
            target="_blank"
            rel="nofollow noopener noreferrer"
            title={`Open ${provider}`}
            className="size-14 flex justify-center items-center border bg-border/[0.05] rounded-xl hover:border-ring hover:bg-ring/[0.15]"
          >
            <Image src={icon} alt={`Open ${provider}`} width="30" height="30" />
          </a>
        ))}
      </Stack>

      <p className="text-xs text-muted-foreground/75">
        No email in your inbox? Check your spam folder or{" "}
        <Link
          href="/auth/login"
          className="text-muted-foreground font-medium hover:text-foreground"
        >
          try a different email address
        </Link>
        .
      </p>
    </>
  )
}

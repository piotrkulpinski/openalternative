import type { Metadata } from "next"
import { Suspense } from "react"
import { Icon } from "~/components/common/icon"
import { Login } from "~/components/web/auth/login"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { metadataConfig } from "~/config/metadata"

export const metadata: Metadata = {
  title: "Sign in",
  description: "Join the open source community and get access to the dashboard.",
  openGraph: { ...metadataConfig.openGraph, url: "/auth/login" },
  alternates: { ...metadataConfig.alternates, canonical: "/auth/login" },
}

export default function LoginPage() {
  return (
    <>
      <Intro>
        <IntroTitle size="h3">{`${metadata.title}`}</IntroTitle>
        <IntroDescription className="md:text-sm">{metadata.description}</IntroDescription>
      </Intro>

      <Suspense fallback={<Icon name="lucide/loader" className="animate-spin mx-auto" />}>
        <Login />
      </Suspense>
    </>
  )
}

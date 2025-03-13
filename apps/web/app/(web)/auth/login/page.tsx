import { LoaderIcon } from "lucide-react"
import type { Metadata } from "next"
import { Suspense } from "react"
import { Login } from "~/components/web/auth/login"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { metadataConfig } from "~/config/metadata"

export const metadata: Metadata = {
  title: "Sign in",
  description: "Get access to the dashboard and manage your submitted tools.",
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

      <Suspense fallback={<LoaderIcon className="animate-spin mx-auto" />}>
        <Login />
      </Suspense>
    </>
  )
}

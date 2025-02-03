import type { Metadata } from "next"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { LoginButton } from "~/app/(web)/login/login-button"
import { Intro, IntroTitle } from "~/components/web/ui/intro"
import { config } from "~/config"
import { metadataConfig } from "~/config/metadata"
import { auth } from "~/lib/auth"

export const metadata: Metadata = {
  title: `Sign in to ${config.site.name}`,
  openGraph: { ...metadataConfig.openGraph, url: "/login" },
  alternates: { ...metadataConfig.alternates, canonical: "/login" },
}

export default async function LoginPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (session?.user) {
    redirect("/admin")
  }

  return (
    <Intro>
      <IntroTitle>{`${metadata.title}`}</IntroTitle>
      <LoginButton provider="google" className="mt-4" />
    </Intro>
  )
}

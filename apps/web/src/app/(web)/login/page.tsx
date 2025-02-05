import type { Metadata } from "next"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { LoginButton } from "~/app/(web)/login/login-button"
import { Stack } from "~/components/common/stack"
import { Card } from "~/components/web/ui/card"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { config } from "~/config"
import { metadataConfig } from "~/config/metadata"
import { auth } from "~/lib/auth"

export const metadata: Metadata = {
  title: "Sign in",
  description: `Login to ${config.site.name} to access your dashboard and manage your tools (soon).`,
  openGraph: { ...metadataConfig.openGraph, url: "/login" },
  alternates: { ...metadataConfig.alternates, canonical: "/login" },
}

export default async function LoginPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (session?.user) {
    redirect("/")
  }

  return (
    <Card hover={false} focus={false} className="max-w-sm mx-auto md:p-8 md:pt-6">
      <Intro>
        <IntroTitle size="h2">{`${metadata.title}`}</IntroTitle>
        <IntroDescription className="md:text-base">{metadata.description}</IntroDescription>
      </Intro>

      <Stack direction="column" className="items-stretch w-full gap-4">
        <LoginButton provider="google" suffix={<img src="/google.svg" alt="" />} />
        <LoginButton provider="github" suffix={<img src="/github.svg" alt="" />} />
      </Stack>
    </Card>
  )
}

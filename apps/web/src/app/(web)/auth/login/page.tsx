import type { Metadata } from "next"
import { Suspense } from "react"
import { LoginButton } from "~/app/(web)/auth/login/login-button"
import { BrandGitHubIcon } from "~/components/common/icons/brand-github"
import { BrandGoogleIcon } from "~/components/common/icons/brand-google"
import { Stack } from "~/components/common/stack"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { config } from "~/config"
import { metadataConfig } from "~/config/metadata"

export const metadata: Metadata = {
  title: "Sign in",
  description: `Login to ${config.site.name} to access your dashboard and manage your tools (soon).`,
  openGraph: { ...metadataConfig.openGraph, url: "/auth/login" },
  alternates: { ...metadataConfig.alternates, canonical: "/auth/login" },
}

export default function LoginPage() {
  return (
    <>
      <Intro>
        <IntroTitle size="h2">{`${metadata.title}`}</IntroTitle>
        <IntroDescription className="md:text-base">{metadata.description}</IntroDescription>
      </Intro>

      <Stack direction="column" className="items-stretch w-full gap-4">
        {/* <LoginForm />

        <div className="flex items-center justify-center gap-3 text-sm text-muted before:flex-1 before:border-t after:flex-1 after:border-t">
          or
        </div> */}
        <Suspense>
          <LoginButton provider="google" suffix={<BrandGoogleIcon />} />
          <LoginButton provider="github" suffix={<BrandGitHubIcon />} />
        </Suspense>
      </Stack>
    </>
  )
}

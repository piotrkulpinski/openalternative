import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { Button } from "~/components/web/ui/button"
import { Intro, IntroTitle } from "~/components/web/ui/intro"
import { config } from "~/config"
import { metadataConfig } from "~/config/metadata"
import { auth, signIn } from "~/lib/auth"

export const metadata: Metadata = {
  title: `Sign in to ${config.site.name}`,
  openGraph: { ...metadataConfig.openGraph, url: "/login" },
  alternates: { ...metadataConfig.alternates, canonical: "/login" },
}

export default async function LoginPage() {
  const session = await auth()

  if (session?.user) {
    redirect("/admin")
  }

  const handleSignIn = async () => {
    "use server"
    await signIn("google", { redirectTo: "/admin" })
  }

  return (
    <Intro>
      <IntroTitle>{`${metadata.title}`}</IntroTitle>

      <Button size="lg" className="mt-4" onClick={handleSignIn}>
        Continue with Google
      </Button>
    </Intro>
  )
}

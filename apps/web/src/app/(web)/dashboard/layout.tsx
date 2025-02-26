import type { Metadata } from "next"
import type { PropsWithChildren } from "react"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { metadataConfig } from "~/config/metadata"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage your account and tools.",
  openGraph: { ...metadataConfig.openGraph, url: "/dashboard" },
  alternates: { ...metadataConfig.alternates, canonical: "/dashboard" },
}

export default function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <>
      <Intro>
        <IntroTitle>Dashboard</IntroTitle>
        <IntroDescription>Welcome back! Manage your account and tools.</IntroDescription>
      </Intro>

      <div className="flex flex-col gap-4">
        {/* <DashboardNav className="mb-2" /> */}

        {children}
      </div>
    </>
  )
}

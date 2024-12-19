import type { Metadata } from "next"
import type { PropsWithChildren } from "react"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { metadataConfig } from "~/config/metadata"
import { StackAnalyzerForm } from "./form"

export const metadata: Metadata = {
  title: "GitHub Tech Stack Analyzer",
  description:
    "Analyze the tech stack of any public GitHub repository instantly. Discover the frameworks, libraries, and tools used in any project.",
  openGraph: { ...metadataConfig.openGraph, url: "/tools/github-stack-analyzer" },
  alternates: { ...metadataConfig.alternates, canonical: "/tools/github-stack-analyzer" },
}

export default function StackAnalyzerLayout({ children }: PropsWithChildren) {
  return (
    <>
      <Intro>
        <IntroTitle>{`${metadata.title}`}</IntroTitle>
        <IntroDescription>{metadata.description}</IntroDescription>
      </Intro>

      <StackAnalyzerForm />

      {children}
    </>
  )
}

"use cache"

import { notFound } from "next/navigation"
import { Suspense } from "react"
import { AlternativeActions } from "~/app/admin/alternatives/_components/alternative-actions"
import { AlternativeForm } from "~/app/admin/alternatives/_components/alternative-form"
import { Wrapper } from "~/components/admin/ui/wrapper"
import { H3 } from "~/components/common/heading"
import { findAlternativeBySlug } from "~/server/admin/alternatives/queries"
import { findToolList } from "~/server/admin/tools/queries"

type PageProps = {
  params: Promise<{ slug: string }>
}

export default async function UpdateAlternativePage({ params }: PageProps) {
  const { slug } = await params
  const alternative = await findAlternativeBySlug(slug)

  if (!alternative) {
    return notFound()
  }

  return (
    <Wrapper size="md">
      <div className="flex items-center justify-between gap-4">
        <H3>Update alternative</H3>

        <Suspense>
          <AlternativeActions alternative={alternative} />
        </Suspense>
      </div>

      <Suspense>
        <AlternativeForm alternative={alternative} tools={findToolList()} />
      </Suspense>
    </Wrapper>
  )
}

import { notFound } from "next/navigation"
import { AlternativeActions } from "~/app/admin/alternatives/_components/alternative-actions"
import { AlternativeForm } from "~/app/admin/alternatives/_components/alternative-form"
import { getAlternativeBySlug, getTools } from "~/app/admin/alternatives/_lib/queries"
import { Wrapper } from "~/components/admin/ui/wrapper"
import { H3 } from "~/components/common/heading"
import { requireAuthentication } from "~/utils/auth"

type PageProps = {
  params: Promise<{ slug: string }>
}

export default async function UpdateAlternativePage({ params }: PageProps) {
  await requireAuthentication()

  const { slug } = await params
  const [alternative, tools] = await Promise.all([getAlternativeBySlug(slug), getTools()])

  if (!alternative) {
    return notFound()
  }

  return (
    <Wrapper size="md">
      <div className="flex items-center justify-between gap-4">
        <H3>Update alternative</H3>

        <AlternativeActions alternative={alternative} />
      </div>

      <AlternativeForm alternative={alternative} tools={tools} />
    </Wrapper>
  )
}

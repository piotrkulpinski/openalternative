import { notFound } from "next/navigation"
import { AlternativeActions } from "~/app/(dashboard)/alternatives/_components/alternative-actions"
import { AlternativeForm } from "~/app/(dashboard)/alternatives/_components/alternative-form"
import { getAlternativeById, getTools } from "~/app/(dashboard)/alternatives/_lib/queries"
import { H3 } from "~/components/ui/heading"
import { Wrapper } from "~/components/ui/wrapper"

export default async function UpdateAlternativePage({ params }: { params: { id: string } }) {
  const [alternative, tools] = await Promise.all([getAlternativeById(params.id), getTools()])

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

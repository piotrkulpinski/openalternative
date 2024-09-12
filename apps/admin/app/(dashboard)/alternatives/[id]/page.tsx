import { notFound } from "next/navigation"
import { AlternativeForm } from "~/app/(dashboard)/alternatives/_components/alternative-form"
import { getAlternativeById, getTools } from "~/app/(dashboard)/alternatives/_lib/queries"
import { H3 } from "~/components/ui/heading"

export default async function UpdateAlternativePage({ params }: { params: { id: string } }) {
  const [alternative, tools] = await Promise.all([getAlternativeById(params.id), getTools()])

  if (!alternative) {
    return notFound()
  }

  return (
    <>
      <H3>Update alternative</H3>

      <AlternativeForm alternative={alternative} tools={tools} className="mt-4" />
    </>
  )
}

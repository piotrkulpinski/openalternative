import { AlternativeForm } from "~/app/(dashboard)/alternatives/_components/AlternativeForm"
import { getTools } from "~/app/(dashboard)/alternatives/_lib/queries"
import { H3 } from "~/components/ui/Heading"

export default async function CreateAlternativePage() {
  const tools = await getTools()

  return (
    <>
      <H3>Create alternative</H3>

      <AlternativeForm tools={tools} className="mt-4" />
    </>
  )
}

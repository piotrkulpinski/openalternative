import { AlternativeForm } from "~/app/(dashboard)/alternatives/_components/alternative-form"
import { getTools } from "~/app/(dashboard)/alternatives/_lib/queries"
import { H3 } from "~/components/ui/heading"
import { Wrapper } from "~/components/ui/wrapper"

export default async function CreateAlternativePage() {
  const tools = await getTools()

  return (
    <Wrapper size="md">
      <H3>Create alternative</H3>

      <AlternativeForm tools={tools} />
    </Wrapper>
  )
}

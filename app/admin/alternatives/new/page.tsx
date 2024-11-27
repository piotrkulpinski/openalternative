import { AlternativeForm } from "~/app/admin/alternatives/_components/alternative-form"
import { getTools } from "~/app/admin/alternatives/_lib/queries"
import { Wrapper } from "~/components/admin/ui/wrapper"
import { H3 } from "~/components/common/heading"

export default async function CreateAlternativePage() {
  const tools = await getTools()

  return (
    <Wrapper size="md">
      <H3>Create alternative</H3>

      <AlternativeForm tools={tools} />
    </Wrapper>
  )
}

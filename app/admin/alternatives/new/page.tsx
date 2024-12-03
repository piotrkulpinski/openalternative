import { Suspense } from "react"
import { AlternativeForm } from "~/app/admin/alternatives/_components/alternative-form"
import { Wrapper } from "~/components/admin/ui/wrapper"
import { H3 } from "~/components/common/heading"
import { findToolList } from "~/server/admin/tools/queries"

export default function CreateAlternativePage() {
  return (
    <Wrapper size="md">
      <H3>Create alternative</H3>

      <Suspense>
        <AlternativeForm tools={findToolList()} />
      </Suspense>
    </Wrapper>
  )
}

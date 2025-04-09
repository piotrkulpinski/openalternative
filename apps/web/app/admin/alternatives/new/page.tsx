import { AlternativeForm } from "~/app/admin/alternatives/_components/alternative-form"
import { withAdminPage } from "~/components/admin/auth-hoc"
import { Wrapper } from "~/components/admin/wrapper"
import { H3 } from "~/components/common/heading"
import { findToolList } from "~/server/admin/tools/queries"

const CreateAlternativePage = () => {
  return (
    <Wrapper size="md">
      <H3>Create alternative</H3>

      <AlternativeForm tools={findToolList()} />
    </Wrapper>
  )
}

export default withAdminPage(CreateAlternativePage)

import { AlternativeForm } from "~/app/admin/alternatives/_components/alternative-form"
import { withAdminPage } from "~/components/admin/auth-hoc"
import { Wrapper } from "~/components/admin/wrapper"
import { findToolList } from "~/server/admin/tools/queries"

const CreateAlternativePage = () => {
  return (
    <Wrapper size="md">
      <AlternativeForm title="Create alternative" tools={findToolList()} />
    </Wrapper>
  )
}

export default withAdminPage(CreateAlternativePage)

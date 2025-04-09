import { ToolForm } from "~/app/admin/tools/_components/tool-form"
import { withAdminPage } from "~/components/admin/auth-hoc"
import { Wrapper } from "~/components/admin/wrapper"
import { H3 } from "~/components/common/heading"
import { findAlternativeList } from "~/server/admin/alternatives/queries"
import { findCategoryList } from "~/server/admin/categories/queries"

const CreateToolPage = () => {
  return (
    <Wrapper size="md">
      <H3>Create tool</H3>

      <ToolForm alternatives={findAlternativeList()} categories={findCategoryList()} />
    </Wrapper>
  )
}

export default withAdminPage(CreateToolPage)

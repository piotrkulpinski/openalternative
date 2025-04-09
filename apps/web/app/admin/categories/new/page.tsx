import { CategoryForm } from "~/app/admin/categories/_components/category-form"
import { withAdminPage } from "~/components/admin/auth-hoc"
import { Wrapper } from "~/components/admin/wrapper"
import { H3 } from "~/components/common/heading"
import { findCategoryList } from "~/server/admin/categories/queries"
import { findToolList } from "~/server/admin/tools/queries"

const CreateCategoryPage = () => {
  return (
    <Wrapper size="md">
      <H3>Create category</H3>

      <CategoryForm tools={findToolList()} categories={findCategoryList()} />
    </Wrapper>
  )
}

export default withAdminPage(CreateCategoryPage)

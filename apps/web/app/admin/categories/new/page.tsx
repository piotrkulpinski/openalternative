import { CategoryForm } from "~/app/admin/categories/_components/category-form"
import { withAdminPage } from "~/components/admin/auth-hoc"
import { Wrapper } from "~/components/admin/wrapper"
import { findCategoryList } from "~/server/admin/categories/queries"
import { findToolList } from "~/server/admin/tools/queries"

const CreateCategoryPage = () => {
  return (
    <Wrapper size="md">
      <CategoryForm
        title="Create category"
        toolsPromise={findToolList()}
        categoriesPromise={findCategoryList()}
      />
    </Wrapper>
  )
}

export default withAdminPage(CreateCategoryPage)

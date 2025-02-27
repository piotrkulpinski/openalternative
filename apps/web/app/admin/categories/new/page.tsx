import { CategoryForm } from "~/app/admin/categories/_components/category-form"
import { Wrapper } from "~/components/admin/wrapper"
import { H3 } from "~/components/common/heading"
import { findToolList } from "~/server/admin/tools/queries"

export default function CreateCategoryPage() {
  return (
    <Wrapper size="md">
      <H3>Create category</H3>

      <CategoryForm tools={findToolList()} />
    </Wrapper>
  )
}

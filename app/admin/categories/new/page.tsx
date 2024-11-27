import { CategoryForm } from "~/app/admin/categories/_components/category-form"
import { getTools } from "~/app/admin/categories/_lib/queries"
import { Wrapper } from "~/components/admin/ui/wrapper"
import { H3 } from "~/components/common/heading"

export default async function CreateCategoryPage() {
  const tools = await getTools()

  return (
    <Wrapper size="md">
      <H3>Create category</H3>

      <CategoryForm tools={tools} />
    </Wrapper>
  )
}

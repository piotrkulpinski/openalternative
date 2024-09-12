import { CategoryForm } from "~/app/(dashboard)/categories/_components/category-form"
import { getTools } from "~/app/(dashboard)/categories/_lib/queries"
import { H3 } from "~/components/ui/heading"

export default async function CreateCategoryPage() {
  const tools = await getTools()

  return (
    <>
      <H3>Create category</H3>

      <CategoryForm tools={tools} className="mt-4" />
    </>
  )
}

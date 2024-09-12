import { ToolForm } from "~/app/(dashboard)/tools/_components/tool-form"
import { getAlternatives, getCategories } from "~/app/(dashboard)/tools/_lib/queries"
import { H3 } from "~/components/ui/heading"

export default async function CreateToolPage() {
  const [alternatives, categories] = await Promise.all([getAlternatives(), getCategories()])

  return (
    <>
      <H3>Create tool</H3>

      <ToolForm alternatives={alternatives} categories={categories} className="mt-4" />
    </>
  )
}

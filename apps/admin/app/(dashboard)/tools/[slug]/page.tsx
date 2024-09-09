import { notFound } from "next/navigation"
import UpdateToolForm from "~/app/(dashboard)/tools/[slug]/UpdateToolForm"
import { getToolBySlug } from "~/app/(dashboard)/tools/lib/queries"
import { H3 } from "~/components/ui/Heading"

export default async function UpdateToolPage({ params }: { params: { slug: string } }) {
  const tool = await getToolBySlug(params.slug)

  if (!tool) {
    return notFound()
  }

  return (
    <>
      <H3>Update tool</H3>

      <UpdateToolForm tool={tool} />
    </>
  )
}

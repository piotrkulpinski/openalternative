import { notFound } from "next/navigation"
import { AlternativeForm } from "~/app/admin/alternatives/_components/alternative-form"
import { withAdminPage } from "~/components/admin/auth-hoc"
import { Wrapper } from "~/components/admin/wrapper"
import { findAlternativeBySlug } from "~/server/admin/alternatives/queries"
import { findToolList } from "~/server/admin/tools/queries"

type PageProps = {
  params: Promise<{ slug: string }>
}

const UpdateAlternativePage = async ({ params }: PageProps) => {
  const { slug } = await params
  const alternative = await findAlternativeBySlug(slug)

  if (!alternative) {
    return notFound()
  }

  return (
    <Wrapper size="md">
      <AlternativeForm
        title="Update alternative"
        alternative={alternative}
        toolsPromise={findToolList()}
      />
    </Wrapper>
  )
}

export default withAdminPage(UpdateAlternativePage)

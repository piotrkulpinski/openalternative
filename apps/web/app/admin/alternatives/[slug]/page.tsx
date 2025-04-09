import { notFound } from "next/navigation"
import { UpdateAlternativeActions } from "~/app/admin/alternatives/[slug]/actions"
import { AlternativeForm } from "~/app/admin/alternatives/_components/alternative-form"
import { withAdminPage } from "~/components/admin/auth-hoc"
import { Wrapper } from "~/components/admin/wrapper"
import { H3 } from "~/components/common/heading"
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
      <div className="flex items-center justify-between gap-4">
        <H3>Update alternative</H3>

        <UpdateAlternativeActions alternative={alternative} />
      </div>

      <AlternativeForm alternative={alternative} tools={findToolList()} />
    </Wrapper>
  )
}

export default withAdminPage(UpdateAlternativePage)

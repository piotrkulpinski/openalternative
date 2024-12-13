import { notFound } from "next/navigation"
import { LicenseActions } from "~/app/admin/licenses/_components/license-actions"
import { LicenseForm } from "~/app/admin/licenses/_components/license-form"
import { Wrapper } from "~/components/admin/ui/wrapper"
import { H3 } from "~/components/common/heading"
import { findLicenseBySlug } from "~/server/admin/licenses/queries"

type PageProps = {
  params: Promise<{ slug: string }>
}

export default async function UpdateLicensePage({ params }: PageProps) {
  const { slug } = await params
  const license = await findLicenseBySlug(slug)

  if (!license) {
    return notFound()
  }

  return (
    <Wrapper size="md">
      <div className="flex items-center justify-between gap-4">
        <H3>Update license</H3>

        <LicenseActions license={license} />
      </div>

      <LicenseForm license={license} />
    </Wrapper>
  )
}

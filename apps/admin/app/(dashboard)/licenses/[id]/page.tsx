import { notFound } from "next/navigation"
import { LicenseActions } from "~/app/(dashboard)/licenses/_components/license-actions"
import { LicenseForm } from "~/app/(dashboard)/licenses/_components/license-form"
import { getLicenseById } from "~/app/(dashboard)/licenses/_lib/queries"
import { H3 } from "~/components/ui/heading"
import { Wrapper } from "~/components/ui/wrapper"

export default async function UpdateLicensePage({ params }: { params: { id: string } }) {
  const license = await getLicenseById(params.id)

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

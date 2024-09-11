import { notFound } from "next/navigation"
import { LicenseForm } from "~/app/(dashboard)/licenses/_components/LicenseForm"
import { getLicenseById } from "~/app/(dashboard)/licenses/_lib/queries"
import { H3 } from "~/components/ui/Heading"

export default async function UpdateLicensePage({ params }: { params: { id: string } }) {
  const license = await getLicenseById(params.id)

  if (!license) {
    return notFound()
  }

  return (
    <>
      <H3>Update license</H3>

      <LicenseForm license={license} className="mt-4" />
    </>
  )
}

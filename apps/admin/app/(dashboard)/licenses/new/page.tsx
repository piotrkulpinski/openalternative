import { LicenseForm } from "~/app/(dashboard)/licenses/_components/license-form"
import { H3 } from "~/components/ui/heading"

export default async function CreateLicensePage() {
  return (
    <>
      <H3>Create license</H3>

      <LicenseForm className="mt-4" />
    </>
  )
}

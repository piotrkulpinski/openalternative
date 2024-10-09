import { LicenseForm } from "~/app/(dashboard)/licenses/_components/license-form"
import { H3 } from "~/components/ui/heading"
import { Wrapper } from "~/components/ui/wrapper"

export default async function CreateLicensePage() {
  return (
    <Wrapper size="md">
      <H3>Create license</H3>

      <LicenseForm />
    </Wrapper>
  )
}

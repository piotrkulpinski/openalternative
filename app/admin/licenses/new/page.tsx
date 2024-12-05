import { LicenseForm } from "~/app/admin/licenses/_components/license-form"
import { Wrapper } from "~/components/admin/ui/wrapper"
import { H3 } from "~/components/common/heading"

export default function CreateLicensePage() {
  return (
    <Wrapper size="md">
      <H3>Create license</H3>

      <LicenseForm />
    </Wrapper>
  )
}

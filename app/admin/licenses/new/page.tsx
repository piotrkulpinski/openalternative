import { LicenseForm } from "~/app/admin/licenses/_components/license-form"
import { Wrapper } from "~/components/admin/ui/wrapper"
import { H3 } from "~/components/common/heading"
import { requireAuthentication } from "~/utils/auth"

export default async function CreateLicensePage() {
  await requireAuthentication()

  return (
    <Wrapper size="md">
      <H3>Create license</H3>

      <LicenseForm />
    </Wrapper>
  )
}

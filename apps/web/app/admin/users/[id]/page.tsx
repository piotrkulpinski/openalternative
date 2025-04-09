import { notFound } from "next/navigation"
import { UpdateUserActions } from "~/app/admin/users/[id]/actions"
import { UserForm } from "~/app/admin/users/_components/user-form"
import { withAdminPage } from "~/components/admin/auth-hoc"
import { Wrapper } from "~/components/admin/wrapper"
import { H3 } from "~/components/common/heading"
import { findUserById } from "~/server/admin/users/queries"

type PageProps = {
  params: Promise<{ id: string }>
}

const UpdateUserPage = async ({ params }: PageProps) => {
  const { id } = await params
  const user = await findUserById(id)

  if (!user) {
    return notFound()
  }

  return (
    <Wrapper size="md">
      <div className="flex items-center justify-between gap-4">
        <H3>Update user</H3>

        <UpdateUserActions user={user} />
      </div>

      <UserForm user={user} />
    </Wrapper>
  )
}

export default withAdminPage(UpdateUserPage)

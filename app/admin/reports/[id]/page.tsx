import { notFound } from "next/navigation"
import { ReportForm } from "~/app/admin/reports/_components/report-form"
import { withAdminPage } from "~/components/admin/auth-hoc"
import { Wrapper } from "~/components/admin/wrapper"
import { findReportById } from "~/server/admin/reports/queries"

type PageProps = {
  params: Promise<{ id: string }>
}

const UpdateReportPage = async ({ params }: PageProps) => {
  const { id } = await params
  const report = await findReportById(id)

  if (!report) {
    return notFound()
  }

  return (
    <Wrapper size="md">
      <ReportForm title="Update report" report={report} />
    </Wrapper>
  )
}

export default withAdminPage(UpdateReportPage)

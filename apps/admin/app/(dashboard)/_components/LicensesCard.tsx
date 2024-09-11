import { CopyrightIcon } from "lucide-react"
import { Card } from "~/components/ui/Card"
import { prisma } from "~/services/prisma"

export const LicensesCard = async () => {
  const licenses = await prisma.license.count()

  return <Card title="Licenses" value={licenses} icon={<CopyrightIcon />} />
}

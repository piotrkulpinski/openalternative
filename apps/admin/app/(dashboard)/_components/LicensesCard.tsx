import { CopyrightIcon } from "lucide-react"
import { prisma } from "~/services/prisma"
import { Card } from "./Card"

export const LicensesCard = async () => {
  const licenses = await prisma.license.count()

  return <Card title="Licenses" value={licenses} icon={<CopyrightIcon />} />
}

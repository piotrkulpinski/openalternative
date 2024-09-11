import { ReplaceIcon } from "lucide-react"
import { Card } from "~/components/ui/Card"
import { prisma } from "~/services/prisma"

export const AlternativesCard = async () => {
  const alternatives = await prisma.alternative.count()

  return <Card title="Alternatives" value={alternatives} icon={<ReplaceIcon />} />
}

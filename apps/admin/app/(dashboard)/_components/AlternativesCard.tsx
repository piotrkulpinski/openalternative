import { ReplaceIcon } from "lucide-react"
import { prisma } from "~/services/prisma"
import { Card } from "./Card"

export const AlternativesCard = async () => {
  const alternatives = await prisma.alternative.count()

  return <Card title="Alternatives" value={alternatives} icon={<ReplaceIcon />} />
}

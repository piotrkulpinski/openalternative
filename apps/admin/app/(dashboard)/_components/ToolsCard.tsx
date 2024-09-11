import { DraftingCompassIcon } from "lucide-react"
import { Card } from "~/components/ui/Card"
import { prisma } from "~/services/prisma"

export const ToolsCard = async () => {
  const tools = await prisma.tool.count()

  return <Card title="Tools" value={tools} icon={<DraftingCompassIcon />} />
}

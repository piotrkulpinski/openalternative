import { DraftingCompassIcon } from "lucide-react"
import { prisma } from "~/services/prisma"
import { Card } from "./Card"

export const ToolsCard = async () => {
  const tools = await prisma.tool.count()

  return <Card title="Tools" value={tools} icon={<DraftingCompassIcon />} />
}

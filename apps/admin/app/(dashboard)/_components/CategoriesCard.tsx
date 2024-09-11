import { GalleryHorizontalEndIcon } from "lucide-react"
import { Card } from "~/components/ui/Card"
import { prisma } from "~/services/prisma"

export const CategoriesCard = async () => {
  const categories = await prisma.category.count()

  return <Card title="Categories" value={categories} icon={<GalleryHorizontalEndIcon />} />
}

import { GalleryHorizontalEndIcon } from "lucide-react"
import { prisma } from "~/services/prisma"
import { Card } from "./Card"

export const CategoriesCard = async () => {
  const categories = await prisma.category.count()

  return <Card title="Categories" value={categories} icon={<GalleryHorizontalEndIcon />} />
}

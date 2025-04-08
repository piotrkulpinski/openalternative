import { db } from "@openalternative/db"
import type { Category } from "@openalternative/db/client"

export const getCategoryPath = async (category: Pick<Category, "slug" | "parentId">) => {
  const path: string[] = [category.slug]
  let current = category

  while (current.parentId) {
    const parent = await db.category.findUnique({
      where: { id: current.parentId },
    })

    if (!parent) break

    path.unshift(parent.slug)
    current = parent
  }

  return path.join("/")
}

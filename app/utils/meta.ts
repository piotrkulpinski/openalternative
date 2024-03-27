import { SITE_NAME, SITE_URL } from "./constants"
import { MetaDescriptor } from "@remix-run/node"

type GetMetaTagsProps = {
  title?: string | null
  description?: string | null
  ogImage?: string | null
  parentMeta?: MetaDescriptor[]
}

export const getMetaTags = ({ title, description, ogImage, parentMeta = [] }: GetMetaTagsProps) => {
  return [
    ...parentMeta,
    { title: `${title} – ${SITE_NAME}` },
    { name: "description", content: description },
    { property: "og:title", content: `${title} – ${SITE_NAME}` },
    { property: "og:description", content: description },
    { property: "og:image", content: ogImage ?? `${SITE_URL}/opengraph.png` },
  ].sort(sortMeta)
}

export const sortMeta = (a: object, b: object) => {
  const keys = ["title", "charset", "name", "property", "tagName"]
  const aIndex = keys.indexOf(Object.keys(a)[0] ?? "")
  const bIndex = keys.indexOf(Object.keys(b)[0] ?? "")

  if (aIndex === -1 && bIndex === -1) return 0
  if (aIndex === -1) return 1
  if (bIndex === -1) return -1

  return aIndex - bIndex
}

import { ServerRuntimeMetaDescriptor } from "@remix-run/server-runtime"
import { SITE_NAME } from "./constants"

type GetMetaTagsProps = {
  title?: string | null
  description?: string | null
  ogImage?: string | null
  parentMeta?: ServerRuntimeMetaDescriptor[]
}

export const getMetaTags = ({ title, description, ogImage, parentMeta }: GetMetaTagsProps) => {
  return [
    { title: `${title} – ${SITE_NAME}` },
    { name: "description", content: description },
    { property: "og:title", content: `${title} – ${SITE_NAME}` },
    { property: "og:description", content: description },
    ...(ogImage ? [{ property: "og:image", content: ogImage }] : []),
    ...(parentMeta ?? []),
  ].sort(sortMeta)
}

export const sortMeta = (a: object, b: object) => {
  const keys = ["title", "charset", "name", "property", "tagName"]
  const aIndex = keys.indexOf(Object.keys(a)[0] ?? "")
  const bIndex = keys.indexOf(Object.keys(b)[0] ?? "")

  if (aIndex === -1 && bIndex === -1) {
    return 0
  }

  if (aIndex === -1) {
    return 1
  }

  if (bIndex === -1) {
    return -1
  }

  return aIndex - bIndex
}

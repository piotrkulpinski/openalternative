import type { MetaDescriptor } from "@remix-run/node"
import type { Location } from "@remix-run/router"
import {
  AUTHOR_URL,
  GITHUB_URL,
  LINKEDIN_URL,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_URL,
  TWITTER_URL,
} from "./constants"

export type GetMetaTagsProps = {
  location: Location
  title?: string | null
  description?: string | null
  ogImage?: string | null
  jsonLd?: object[]
  parentMeta?: MetaDescriptor[]
}

export const getMetaTags = ({
  title,
  description,
  ogImage,
  location,
  jsonLd = [],
  parentMeta = [],
}: GetMetaTagsProps) => {
  const metaTitle = title ? `${title} – ${SITE_NAME}` : SITE_NAME
  const metaDescription = description ?? SITE_TAGLINE
  const metaImage = ogImage ?? `${SITE_URL}/opengraph.png`
  const metaUrl = `${SITE_URL}${location.pathname}`

  return [
    ...parentMeta,
    { title: metaTitle },
    { name: "description", content: metaDescription },
    { property: "og:title", content: metaTitle },
    { property: "og:description", content: metaDescription },
    { property: "og:image", content: metaImage },
    {
      "script:ld+json": {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Organization",
            "@id": `${SITE_URL}/#/schema/organization/1`,
            name: SITE_NAME,
            url: `${SITE_URL}/`,
            sameAs: [TWITTER_URL, LINKEDIN_URL, GITHUB_URL],
            logo: {
              "@type": "ImageObject",
              "@id": `${SITE_URL}/#/schema/image/1`,
              url: `${SITE_URL}/favicon.png`,
              width: 480,
              height: 480,
              caption: `${SITE_NAME} Logo`,
            },
            image: {
              "@id": `${SITE_URL}/#/schema/image/2`,
            },
          },
          {
            "@type": "Collection",
            "@id": `${SITE_URL}/#/schema/website/1`,
            url: `${SITE_URL}/`,
            name: SITE_NAME,
            description: SITE_TAGLINE,
            collectionSize: 218,
            publisher: {
              "@id": `${SITE_URL}/#/schema/organization/1`,
            },
          },
          {
            "@type": "Person",
            "@id": `${SITE_URL}#/schema/person/2`,
            name: "Piotr Kulpinski",
            sameAs: [AUTHOR_URL],
          },
          {
            "@type": "ImageObject",
            "@id": `${SITE_URL}/#/schema/image/2`,
            url: metaImage,
            contentUrl: metaImage,
            caption: metaDescription,
          },
          {
            "@type": "WebSite",
            url: metaUrl,
            name: metaTitle,
            description: metaDescription,
            inLanguage: "en-US",
            potentialAction: {
              "@type": "SearchAction",
              target: {
                "@type": "EntryPoint",
                urlTemplate: `${SITE_URL}/?openalternative[query]={search_term_string}`,
              },
              "query-input": "required name=search_term_string",
            },
            isPartOf: { "@id": `${SITE_URL}#/schema/website/1` },
            about: { "@id": `${SITE_URL}#/schema/organization/1` },
          },
          ...jsonLd,
        ],
      },
    },
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

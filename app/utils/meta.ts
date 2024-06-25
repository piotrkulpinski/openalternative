import type { MetaDescriptor } from "@remix-run/node"
import type { Location } from "@remix-run/router"
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "./constants"

type GetMetaTagsProps = {
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
            sameAs: ["https://x.com/ossalternative"],
            logo: {
              "@type": "ImageObject",
              "@id": `${SITE_URL}/#/schema/image/1`,
              url: `${SITE_URL}/favicon.png`,
              width: "480",
              height: "480",
              caption: `${SITE_NAME} Logo`,
            },
            image: {
              "@id": `${SITE_URL}/#/schema/image/2`,
            },
          },
          {
            "@type": "Person",
            "@id": `${SITE_URL}#/schema/person/2`,
            name: "Piotr Kulpinski",
            sameAs: [
              "https://x.com/piotrkulpinski",
              "https://inkedin.com/in/piotrkulpinski",
              "https://github.com/piotrkulpinski",
            ],
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
            potentialAction:
              location.pathname === "/"
                ? // If we're on the homepage, we want to add a search action
                  {
                    "@type": "SearchAction",
                    target: {
                      "@type": "EntryPoint",
                      urlTemplate: `${SITE_URL}/?openalternative[query]={search_term_string}`,
                    },
                    "query-input": "required name=search_term_string",
                  }
                : // Otherwise, we want to add a read action
                  {
                    "@type": "ReadAction",
                    target: metaUrl,
                  },
            about: { "@id": `${SITE_URL}#/schema/organization/1` },
            primaryImageOfPage: { "@id": `${SITE_URL}#/schema/image/2` },
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

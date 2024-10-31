import { type LoaderFunctionArgs, type MetaFunction, json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { Intro } from "~/components/ui/intro"
import { toolOnePayload } from "~/services.server/api"
import { prisma } from "~/services.server/prisma"
import { JSON_HEADERS, SITE_EMAIL, SITE_NAME } from "~/utils/constants"
import { type GetMetaTagsProps, getMetaTags } from "~/utils/meta"
import { isToolPublished } from "~/utils/tools"

export const meta: MetaFunction<typeof loader> = ({ matches, data, location }) => {
  const { title, description } = data?.meta || {}

  return getMetaTags({
    location,
    title,
    description,
    parentMeta: matches.find(({ id }) => id === "root")?.meta,
  })
}

export const loader = async ({ params: { tool: slug } }: LoaderFunctionArgs) => {
  let meta: Partial<GetMetaTagsProps> = {}

  try {
    const tool = await prisma.tool.findUniqueOrThrow({
      where: { slug },
      include: toolOnePayload,
    })

    if (isToolPublished(tool)) {
      meta = {
        title: "Thank you for your payment!",
        description: `We've received your payment. ${tool.name} should be featured on ${SITE_NAME} shortly. If you have any questions, please contact us at ${SITE_EMAIL}.`,
      }
    } else {
      meta = {
        title: `Thank you for submitting ${tool.name}!`,
        description: `We've received your submission. We'll review it shortly and get back to you with any questions or feedback.`,
      }
    }

    return json({ tool, meta }, { headers: { ...JSON_HEADERS } })
  } catch (error) {
    console.error(error)
    throw json(null, { status: 404, statusText: "Not Found" })
  }
}

export default function SubmitPagePackage() {
  const { meta } = useLoaderData<typeof loader>()

  return (
    <>
      <Intro alignment="center" {...meta} />

      <img src="/thanks.gif" alt="" className="max-w-2xl w-full h-auto mx-auto rounded-lg" />
    </>
  )
}

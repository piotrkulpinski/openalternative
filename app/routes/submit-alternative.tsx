import { Prisma } from "@prisma/client"
import {
  type ActionFunctionArgs,
  type MetaFunction,
  type TypedResponse,
  json,
} from "@remix-run/node"
import { Form, useActionData, useLoaderData, useNavigation } from "@remix-run/react"
import slugify from "@sindresorhus/slugify"
import { type ZodFormattedError, z } from "zod"
import { BreadcrumbsLink } from "~/components/Breadcrumbs"
import { Button } from "~/components/Button"
import { Intro } from "~/components/Intro"
import { Input } from "~/components/forms/Input"
import { Label } from "~/components/forms/Label"
import { TextArea } from "~/components/forms/TextArea"
import { inngest } from "~/services.server/inngest"
import { prisma } from "~/services.server/prisma"
import { SITE_NAME } from "~/utils/constants"
import { getMetaTags } from "~/utils/meta"

export const handle = {
  noTemplate: true,
  breadcrumb: () => <BreadcrumbsLink to="/submit-alternative" label="Submit Alternative" />,
}

export const meta: MetaFunction<typeof loader> = ({ matches, data, location }) => {
  const { title, description } = data?.meta || {}

  return getMetaTags({
    location,
    title,
    description,
    parentMeta: matches.find(({ id }) => id === "root")?.meta,
  })
}

export const loader = () => {
  const meta = {
    title: "Submit a Proprierary Software",
    description: `Help us grow the list of open source alternatives to proprietary software. Contribute to ${SITE_NAME} by submitting a new open source alternative.`,
  }

  return json({ meta })
}

const schema = z.object({
  name: z.string().min(1),
  website: z.string().url().min(1),
  description: z.string().min(1).max(200),
})

export type ActionState =
  | { type: "error"; error: ZodFormattedError<z.infer<typeof schema>> }
  | { type: "success"; message: string }

export async function action({ request }: ActionFunctionArgs): Promise<TypedResponse<ActionState>> {
  const data = await request.formData()
  const parsed = schema.safeParse(Object.fromEntries(data.entries()))

  if (!parsed.success) {
    return json({ type: "error", error: parsed.error.format() })
  }

  // Destructure the parsed data
  const { name, website, description } = parsed.data

  // Save the tool to the database
  try {
    const tool = await prisma.alternative.create({
      data: {
        name,
        website,
        description,
        slug: slugify(name, { decamelize: false }),
      },
    })

    // Send an event to the Inngest pipeline
    await inngest.send({ name: "alternative.created", data: { id: tool.id } })

    // Return a success response
    return json({
      type: "success",
      message: "Thank you for submitting!",
    })
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.meta?.target) {
      const schemaKeys = Object.keys(schema.shape)
      const name = (e.meta?.target as string[]).find(t => schemaKeys.includes(t)) || "name"

      if (name && e.code === "P2002") {
        return json({
          type: "error",
          error: { [name]: { _errors: [`That ${name} has already been submitted.`] } },
        } as unknown as ActionState)
      }
    }

    throw e
  }
}

export default function SubmitPage() {
  const { formMethod, state } = useNavigation()
  const { meta } = useLoaderData<typeof loader>()
  const data = useActionData<typeof action>()

  return (
    <>
      <Intro {...meta} />

      {data?.type !== "success" && (
        <div className="flex flex-col-reverse items-start gap-12 lg:flex-row">
          <Form method="POST" className="grid-auto-fill-xs grid w-full max-w-xl gap-6" noValidate>
            <div className="flex flex-col gap-1">
              <Label htmlFor="name" isRequired>
                Name:
              </Label>

              <Input
                type="text"
                name="name"
                id="name"
                size="md"
                placeholder="Salesforce"
                data-1p-ignore
                required
              />

              {data?.error?.name && (
                <p className="text-xs text-red-600">{data.error.name?._errors[0]}</p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="website" isRequired>
                Website:
              </Label>

              <Input
                type="url"
                name="website"
                id="website"
                size="md"
                placeholder="https://salesforce.com"
                required
              />

              {data?.error?.website && (
                <p className="text-xs text-red-600">{data.error.website?._errors[0]}</p>
              )}
            </div>

            <div className="col-span-full flex flex-col gap-1">
              <Label htmlFor="description" isRequired>
                Description:
              </Label>

              <TextArea
                name="description"
                id="description"
                rows={3}
                size="md"
                placeholder="Deliver the best customer experience with a single CRM tool for Sales, Customer Service, Marketing, Commerce & IT"
                required
              />

              {data?.error?.description && (
                <p className="text-xs text-red-600">{data.error.description?._errors[0]}</p>
              )}
            </div>

            <div>
              <Button isPending={state !== "idle" && formMethod === "POST"} className="min-w-32">
                Submit
              </Button>
            </div>
          </Form>
        </div>
      )}

      {data?.type === "success" && <p className="text-base text-green-600">{data.message}</p>}
    </>
  )
}

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
import { Prose } from "~/components/Prose"
import { Input } from "~/components/forms/Input"
import { Label } from "~/components/forms/Label"
import { TextArea } from "~/components/forms/TextArea"
import { inngest } from "~/services.server/inngest"
import { prisma } from "~/services.server/prisma"
import { SITE_EMAIL, SITE_NAME, SUBMISSION_POSTING_RATE } from "~/utils/constants"
import { getMetaTags } from "~/utils/meta"

export const handle = {
  breadcrumb: () => <BreadcrumbsLink to="/submit" label="Submit" />,
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

export const loader = async () => {
  const queueLength = await prisma.tool.count({
    where: { publishedAt: null },
  })

  const meta = {
    title: "Submit your Open Source Software",
    description: `Help us grow the list of open source alternatives to proprietary software. Contribute to ${SITE_NAME} by submitting a new open source alternative.`,
  }

  return json({ queueLength, meta })
}

const schema = z.object({
  submitter: z.string().min(1),
  email: z.string().email().min(1),
  name: z.string().min(1),
  website: z.string().url().min(1),
  repository: z
    .string()
    .url()
    .refine(
      url => /^https:\/\/github\.com\/([^/]+)\/([^/]+)(\/)?$/.test(url),
      "The repository must be a valid GitHub URL with owner and repo name.",
    ),
  description: z.string().max(200),
})

export type ActionState =
  | { type: "error"; error: ZodFormattedError<z.infer<typeof schema>> }
  | { type: "success"; message: string }

export const action = async ({
  request,
}: ActionFunctionArgs): Promise<TypedResponse<ActionState>> => {
  const data = await request.formData()
  const parsed = schema.safeParse(Object.fromEntries(data.entries()))

  if (!parsed.success) {
    return json({ type: "error", error: parsed.error.format() })
  }

  // Destructure the parsed data
  const { name, website, repository, description, submitter, email } = parsed.data

  // Generate a slug
  const slug = slugify(name, { decamelize: false })

  // Save the tool to the database
  try {
    const tool = await prisma.tool.create({
      data: {
        name,
        slug,
        website,
        repository,
        description,
        submitterName: submitter,
        submitterEmail: email,
      },
    })

    // Send an event to the Inngest pipeline
    await inngest.send({ name: "tool.created", data: { id: tool.id } })

    // Return a success response
    return json({
      type: "success",
      message: "Thank you for submitting! We'll review your tool soon.",
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
  const { queueLength, meta } = useLoaderData<typeof loader>()
  const data = useActionData<typeof action>()

  return (
    <>
      <Intro {...meta} />

      {data?.type !== "success" && (
        <div className="flex flex-col-reverse items-start gap-y-8 gap-x-12 lg:flex-row">
          <Form method="POST" className="grid-auto-fill-xs grid gap-6 w-full max-w-xl" noValidate>
            <div className="flex flex-col gap-1">
              <Label htmlFor="submitter" isRequired>
                Your Name:
              </Label>

              <Input
                type="text"
                name="submitter"
                id="submitter"
                size="md"
                placeholder="John Doe"
                data-1p-ignore
                required
              />

              {data?.error?.submitter && (
                <p className="text-xs text-red-600">{data.error.submitter?._errors[0]}</p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="email" isRequired>
                Your Email:
              </Label>

              <Input
                type="url"
                name="email"
                id="email"
                size="md"
                placeholder="john@doe.com"
                required
              />

              {data?.error?.email && (
                <p className="text-xs text-red-600">{data.error.email?._errors[0]}</p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="name" isRequired>
                Name:
              </Label>

              <Input
                type="text"
                name="name"
                id="name"
                size="md"
                placeholder="PostHog"
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
                placeholder="https://posthog.com"
                required
              />

              {data?.error?.website && (
                <p className="text-xs text-red-600">{data.error.website?._errors[0]}</p>
              )}
            </div>

            <div className="col-span-full flex flex-col gap-1">
              <Label htmlFor="repository" isRequired>
                Repository:
              </Label>

              <Input
                type="url"
                name="repository"
                id="repository"
                size="md"
                placeholder="https://github.com/posthog/posthog"
                required
              />

              {data?.error?.repository && (
                <p className="text-xs text-red-600">{data.error.repository?._errors[0]}</p>
              )}
            </div>

            <div className="col-span-full flex flex-col gap-1">
              <Label htmlFor="description">Description:</Label>

              <TextArea
                name="description"
                id="description"
                rows={3}
                size="md"
                placeholder="A platform that helps engineers build better products"
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

          <Prose className="flex-1 text-pretty text-sm/normal">
            <p>Please make sure the software you're submitting meets the following criteria:</p>

            <ul>
              <li>It's open source</li>
              <li>It's free to use or can be self-hosted</li>
              <li>It's actively maintained</li>
              <li>It's a good alternative to a proprietary software</li>
            </ul>
          </Prose>
        </div>
      )}

      {data?.type === "success" && <p className="text-base text-green-600">{data.message}</p>}

      <Prose className="text-sm">
        <p>
          <strong>Note:</strong> There are currently {queueLength} submissions in the queue.
          Considering our current posting rate, it may take up to{" "}
          {Math.ceil(queueLength / SUBMISSION_POSTING_RATE)} weeks to publish your submission.
        </p>

        <p>
          To expedite the process, please email us at{" "}
          <a href={`mailto:${SITE_EMAIL}`}>{SITE_EMAIL}</a>.
        </p>
      </Prose>
    </>
  )
}

import { Prisma } from "@prisma/client"
import {
  type ActionFunctionArgs,
  type MetaFunction,
  type TypedResponse,
  json,
} from "@remix-run/node"
import { Form, useActionData, useLoaderData, useNavigation } from "@remix-run/react"
import slugify from "@sindresorhus/slugify"
import { ArrowBigUpDashIcon } from "lucide-react"
import { z } from "zod"
import { BreadcrumbsLink } from "~/components/Breadcrumbs"
import { Button } from "~/components/Button"
import { Intro } from "~/components/Intro"
import { Prose } from "~/components/Prose"
import { Checkbox } from "~/components/forms/Checkbox"
import { ErrorMessage } from "~/components/forms/ErrorMessage"
import { Input } from "~/components/forms/Input"
import { Label } from "~/components/forms/Label"
import { subscribeToBeehiiv } from "~/services.server/beehiiv"
import { inngest } from "~/services.server/inngest"
import { prisma } from "~/services.server/prisma"
import { SITE_EMAIL, SITE_NAME, SUBMISSION_POSTING_RATE } from "~/utils/constants"
import { isRealEmail } from "~/utils/helpers"
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
  submitterName: z.string().min(1, { message: "Your name is required" }),
  submitterEmail: z
    .string()
    .min(1, { message: "Your email is required" })
    .email("Invalid email address, please use a correct format.")
    .refine(isRealEmail, "Invalid email address, please use a real one."),
  submitterNote: z.string().max(200),
  name: z.string().min(1, { message: "Name is required" }),
  website: z.string().min(1, { message: "Website is required" }).url(),
  repository: z
    .string()
    .min(1, { message: "Repository is required" })
    .url()
    .refine(
      url => /^https:\/\/github\.com\/([^/]+)\/([^/]+)(\/)?$/.test(url),
      "The repository must be a valid GitHub URL with owner and repo name.",
    ),
  newsletterOptIn: z.coerce.boolean().default(true),
})

type SubmitError = z.inferFlattenedErrors<typeof schema>

export type ActionState = TypedResponse<
  { type: "error"; error: SubmitError } | { type: "success"; toolName: string }
>

export const action = async ({ request }: ActionFunctionArgs): Promise<ActionState> => {
  const data = await request.formData()
  const parsed = await schema.safeParseAsync(Object.fromEntries(data.entries()))

  if (!parsed.success) {
    return json({ type: "error", error: parsed.error.flatten() })
  }

  // Destructure the parsed data
  const {
    name,
    website,
    repository,
    submitterName,
    submitterEmail,
    submitterNote,
    newsletterOptIn,
  } = parsed.data

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
        submitterName,
        submitterEmail,
        submitterNote,
      },
    })

    // Send an event to the Inngest pipeline
    await inngest.send({ name: "tool.created", data: { id: tool.id } })

    if (newsletterOptIn) {
      try {
        const newsletterFormData = new FormData()
        newsletterFormData.append("email", submitterEmail)
        newsletterFormData.append("utm_medium", "submit_form")

        // Subscribe to the newsletter
        await subscribeToBeehiiv(newsletterFormData)
      } catch {}
    }

    // Return a success response with the tool name
    return json({
      type: "success",
      toolName: tool.name,
    })
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.meta?.target) {
      const schemaKeys = Object.keys(schema.shape)
      const name = (e.meta?.target as string[]).find(t => schemaKeys.includes(t)) || "name"

      if (name && e.code === "P2002") {
        return json({
          type: "error",
          error: { formErrors: [`That ${name} has already been submitted.`], fieldErrors: {} },
        })
      }
    }

    throw e
  }
}

export default function SubmitPage() {
  const { formMethod, state } = useNavigation()
  const { queueLength, meta } = useLoaderData<typeof loader>()
  const data = useActionData<typeof action>()

  const params =
    data?.type === "success"
      ? new URLSearchParams({
          subject: `Expedite submission of ${data.toolName} — ${SITE_NAME}`,
          body: `Hi Team,\n\nI have recently submitted ${data.toolName} on ${SITE_NAME}.\n\nIs there a way to expedite the submission process?\n\nThanks!`,
        })
      : undefined

  return (
    <>
      <Intro {...meta} />

      {data?.type !== "success" && (
        <>
          <Form method="POST" className="grid-auto-fill-sm grid gap-6 w-full max-w-2xl" noValidate>
            <div className="flex flex-col gap-1">
              <Label htmlFor="submitterName" isRequired>
                Your Name:
              </Label>

              <Input
                type="text"
                name="submitterName"
                id="submitterName"
                size="lg"
                placeholder="John Doe"
                data-1p-ignore
                required
              />

              <ErrorMessage errors={data?.error.fieldErrors.submitterName} />
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="submitterEmail" isRequired>
                Your Email:
              </Label>

              <Input
                type="url"
                name="submitterEmail"
                id="submitterEmail"
                size="lg"
                placeholder="john@doe.com"
                required
              />

              <ErrorMessage errors={data?.error.fieldErrors.submitterEmail} />
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="name" isRequired>
                Name:
              </Label>

              <Input
                type="text"
                name="name"
                id="name"
                size="lg"
                placeholder="PostHog"
                data-1p-ignore
                required
              />
              <ErrorMessage errors={data?.error.fieldErrors.name} />
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="website" isRequired>
                Website:
              </Label>

              <Input
                type="url"
                name="website"
                id="website"
                size="lg"
                placeholder="https://posthog.com"
                required
              />

              <ErrorMessage errors={data?.error.fieldErrors.website} />
            </div>

            <div className="col-span-full flex flex-col gap-1">
              <Label htmlFor="repository" isRequired>
                Repository:
              </Label>

              <Input
                type="url"
                name="repository"
                id="repository"
                size="lg"
                placeholder="https://github.com/posthog/posthog"
                required
              />

              <ErrorMessage errors={data?.error.fieldErrors.repository} />
            </div>

            <div className="col-span-full flex flex-col gap-1">
              <Label htmlFor="submitterNote">Suggest an alternative:</Label>

              <Input
                name="submitterNote"
                id="submitterNote"
                size="lg"
                placeholder="Which well-known tool is this an alternative to?"
              />

              <ErrorMessage errors={data?.error.fieldErrors.submitterNote} />
            </div>

            <div className="col-span-full flex items-center gap-2">
              <Checkbox name="newsletterOptIn" id="newsletterOptIn" defaultChecked={true} />

              <Label htmlFor="newsletterOptIn" className="text-sm font-normal">
                I'd like to receive free email updates
              </Label>

              <ErrorMessage errors={data?.error.fieldErrors.newsletterOptIn} />
            </div>

            <div>
              <Button isPending={state !== "idle" && formMethod === "POST"} className="min-w-32">
                Submit
              </Button>
            </div>

            <ErrorMessage errors={data?.error.formErrors} className="col-span-full" />
          </Form>

          <Prose className="text-sm/normal">
            <p>
              <strong>Note:</strong> Submission alone does not guarantee a feature. Please make sure
              the software you're submitting meets the following criteria:
            </p>

            <ul>
              <li>It's open source</li>
              <li>It's free to use or can be self-hosted</li>
              <li>It's actively maintained</li>
              <li>It's a good alternative to a proprietary software</li>
            </ul>
          </Prose>
        </>
      )}

      {data?.type === "success" && (
        <Prose>
          <p>
            <strong>Thank you for submitting! We'll review your tool soon.</strong>
          </p>

          <p>
            <strong>Note:</strong> There are currently {queueLength} submissions in the queue.
            Considering our current posting rate, it may take up to{" "}
            {Math.ceil(queueLength / SUBMISSION_POSTING_RATE)} weeks to publish your submission.
          </p>

          <Button size="lg" className="not-prose mt-2" suffix={<ArrowBigUpDashIcon />} asChild>
            <a
              href={`mailto:${SITE_EMAIL}?${params?.toString()}`}
              target="_blank"
              rel="noreferrer noopener"
            >
              Expedite submission of {data.toolName}
            </a>
          </Button>
        </Prose>
      )}
    </>
  )
}

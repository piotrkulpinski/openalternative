import { Prisma } from "@prisma/client"
import { ActionFunctionArgs, TypedResponse, json } from "@remix-run/node"
import slugify from "@sindresorhus/slugify"
import { ZodFormattedError, z } from "zod"
import { inngest } from "~/services.server/inngest"
import { prisma } from "~/services.server/prisma"

const schema = z.object({
  name: z.string().min(1),
  website: z.string().url().min(1),
  repository: z
    .string()
    .url()
    .refine(
      (url) => /^https:\/\/github\.com\/([^/]+)\/([^/]+)(\/)?$/.test(url),
      "The repository must be a valid GitHub URL with owner and repo name."
    ),
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
  const { name, website, repository, description } = parsed.data

  // Save the tool to the database
  try {
    const tool = await prisma.tool.create({
      data: {
        name,
        website,
        repository,
        description,
        slug: slugify(name, { decamelize: false }),
        isDraft: true,
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
      const name = (e.meta?.target as string[]).find((t) => schemaKeys.includes(t)) || "name"

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

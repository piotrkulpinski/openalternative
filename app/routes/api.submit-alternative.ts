import { Prisma } from "@prisma/client"
import { type ActionFunctionArgs, type TypedResponse, json } from "@remix-run/node"
import slugify from "@sindresorhus/slugify"
import { type ZodFormattedError, z } from "zod"
import { inngest } from "~/services.server/inngest"
import { prisma } from "~/services.server/prisma"

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

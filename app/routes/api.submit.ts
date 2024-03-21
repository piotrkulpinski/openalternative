import { ActionFunctionArgs, TypedResponse, json } from "@remix-run/node"
import { ZodFormattedError, z } from "zod"

const submissionSchema = z.object({
  name: z.string().min(1),
  website: z.string().url().min(1),
  repository: z
    .string()
    .url()
    .refine((url) => url.includes("github.com"), "The repository must be a GitHub URL."),
  description: z.string().min(1).max(200),
})

export type ActionState =
  | { type: "error"; error: ZodFormattedError<z.infer<typeof submissionSchema>> }
  | { type: "success"; message: string }

export async function action({ request }: ActionFunctionArgs): Promise<TypedResponse<ActionState>> {
  const data = await request.formData()
  const parsed = submissionSchema.safeParse(Object.fromEntries(data.entries()))

  if (!parsed.success) {
    return json({ type: "error", error: parsed.error.format() })
  }

  // Return a success response
  return json({ type: "success", message: "Thank you for submitting!" })
}

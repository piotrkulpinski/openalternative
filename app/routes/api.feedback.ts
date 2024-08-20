import { type ActionFunctionArgs, type TypedResponse, json } from "@remix-run/node"
import { z } from "zod"
import { prisma } from "~/services.server/prisma"
import { isRealEmail } from "~/utils/helpers"

const feedbackSchema = z.object({
  toolId: z.string().optional(),
  email: z
    .string()
    .min(1, { message: "Your email is required" })
    .email({ message: "Invalid email address" })
    .refine(isRealEmail, { message: "Invalid email address" }),
  feedback: z.string().min(1, { message: "Feedback is required" }),
})

type FeedbackError = z.inferFlattenedErrors<typeof feedbackSchema>

type ActionState = TypedResponse<
  { type: "error"; error: FeedbackError } | { type: "success"; message: string }
>

export async function action({ request }: ActionFunctionArgs): Promise<ActionState> {
  const formData = await request.formData()
  const entries = Object.fromEntries(formData.entries())

  try {
    const { data, success, error } = await feedbackSchema.safeParseAsync(entries)

    if (!success) {
      throw error.flatten()
    }

    // Save feedback to the database
    await prisma.feedback.create({ data })

    return json({ type: "success", message: "Thank you for your feedback!" })
  } catch (error) {
    console.log(error)
    return json({ type: "error", error: error as FeedbackError })
  }
}

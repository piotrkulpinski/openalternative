import { redirect } from "next/navigation"
import { env } from "~/env"
import { auth } from "~/services/auth"

/**
 * Check if the email is allowed to access the admin panel
 * @param email - The email to check
 * @returns - True if the email is allowed, false otherwise
 */
export const isAllowedEmail = (email?: string | null): boolean => {
  // If no allowed emails are set, allow all
  if (!env.AUTH_ALLOWED_EMAILS) return true

  // If no email is provided, do not allow
  if (!email) return false

  // Clean up the allowed emails
  const allowedEmails = env.AUTH_ALLOWED_EMAILS.split(",").map(e => e.trim())

  // Allow specified domains or emails
  return allowedEmails.some(e => (e.includes("@") ? email === e : email.endsWith(e)))
}

/**
 * Require authentication and redirect to login if not authenticated
 */
export const requireAuthentication = async () => {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  return
}

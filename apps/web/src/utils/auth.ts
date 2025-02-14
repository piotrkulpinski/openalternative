import { env } from "~/env"

/**
 * Check if the email is allowed to access the admin panel
 * @param email - The email to check
 * @returns - True if the email is allowed, false otherwise
 */
export const isAdminEmail = (email?: string | null): boolean => {
  // If no admin emails are set, allow all
  if (!env.AUTH_ADMIN_EMAILS) return true

  // If no email is provided, do not allow
  if (!email) return false

  // Clean up the admin emails
  const adminEmails = env.AUTH_ADMIN_EMAILS.split(",").map(e => e.trim())

  // Allow specified domains or emails
  return adminEmails.some(e => (e.includes("@") ? email === e : email.endsWith(e)))
}

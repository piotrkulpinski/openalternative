import { got } from "got"

/**
 * Checks if an email is real by checking if it's in the disposable email domains list.
 *
 * @param email The email to be checked.
 * @returns A boolean indicating whether the email is real.
 */
export const isRealEmail = async (email: string) => {
  const disposableJsonURL =
    "https://rawcdn.githack.com/disposable/disposable-email-domains/master/domains.json"
  const response = await got(disposableJsonURL).json<string[]>()
  const domain = email.split("@")[1]
  const fakeDomains = [...response, "kill-the-newsletter.com", "webmark.eting.org", "dont-reply.me"]

  return !fakeDomains.includes(domain)
}

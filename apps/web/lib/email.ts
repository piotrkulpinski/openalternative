import { render } from "@react-email/components"
import type { ReactElement } from "react"
import type { CreateEmailOptions } from "resend"
import { config } from "~/config"
import { env, isProd } from "~/env"
import { resend } from "~/services/resend"

export type EmailParams = {
  to: string
  subject: string
  react: ReactElement
}

/**
 * Prepares an email for sending
 * @param email - The email to prepare
 * @returns The prepared email
 */
const prepareEmail = async (email: EmailParams): Promise<CreateEmailOptions> => {
  return {
    from: `${config.site.name} <${env.RESEND_SENDER_EMAIL}>`,
    replyTo: config.site.email,
    to: email.to,
    subject: email.subject,
    react: email.react,
    text: await render(email.react, { plainText: true }),
  }
}

/**
 * Sends emails to the given recipients using Resend
 * @param emails - The email/emails to send
 * @returns The response from Resend
 */
export const sendEmails = async (emails: EmailParams | EmailParams[]) => {
  const emailArray = await Promise.all(
    (Array.isArray(emails) ? emails : [emails]).map(prepareEmail),
  )

  if (!isProd) {
    console.log(emailArray)
    return
  }

  return resend.batch.send(emailArray)
}

import "server-only"
import { render } from "@react-email/components"
import type { ReactElement } from "react"
import { config } from "~/config"
import { resend } from "~/services/resend"

export type EmailParams = {
  to: string
  subject: string
  react: ReactElement
}

export const sendEmails = async (emails: EmailParams | EmailParams[]) => {
  const emailArray = Array.isArray(emails) ? emails : [emails]

  const emailPromises = emailArray.map(async ({ to, subject, react }) => ({
    from: `${config.site.name} <${config.site.email}>`,
    to,
    subject,
    react,
    text: await render(react, { plainText: true }),
  }))

  return resend.batch.send(await Promise.all(emailPromises))
}

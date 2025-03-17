import type { Tool } from "@openalternative/db/client"
import { Preview, Section, Text } from "@react-email/components"
import type { Jsonify } from "inngest/helpers/jsonify"
import { config } from "~/config"
import { claimsConfig } from "~/config/claims"
import { EmailWrapper, type EmailWrapperProps } from "~/emails/components/wrapper"

type EmailProps = EmailWrapperProps & {
  tool: Tool | Jsonify<Tool>
  otp: string
}

const EmailToolClaimOtp = ({ tool, otp, ...props }: EmailProps) => {
  const previewText = `Your OTP code to claim ${tool.name} on ${config.site.name}`

  return (
    <EmailWrapper {...props}>
      <Preview>{previewText}</Preview>

      <Text>Hello,</Text>

      <Text>
        You're receiving this email to verify ownership of the domain for{" "}
        <strong>{tool.name}</strong>. Please use the following one-time password (OTP) to complete
        the verification process:
      </Text>

      <Section className="my-4">
        <Text className="inline-block px-4 py-3 bg-gray-100 text-4xl font-bold leading-none tracking-widest tabular-nums rounded-md">
          {otp}
        </Text>
      </Section>

      <Text>
        This code will expire in {claimsConfig.otpExpiration / 60} minutes. Do not share this code
        with anyone.
      </Text>

      <Text>
        If you did not request this verification, you can ignore this email. If you are concerned
        about your account's safety, please reply to this email to get in touch with us.
      </Text>
    </EmailWrapper>
  )
}

export default EmailToolClaimOtp

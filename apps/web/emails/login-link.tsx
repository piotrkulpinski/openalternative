import { Text } from "@react-email/components"
import { config } from "~/config"
import { EmailButton } from "~/emails/components/button"
import { EmailWrapper, type EmailWrapperProps } from "~/emails/components/wrapper"

type EmailProps = EmailWrapperProps & {
  url: string
}

const EmailLoginLink = ({ url, ...props }: EmailProps) => {
  return (
    <EmailWrapper {...props}>
      <Text>Welcome to {config.site.name}!</Text>

      <Text>Please click the magic link below to sign in to your account.</Text>

      <EmailButton href={url}>Sign in to {config.site.name}</EmailButton>

      <Text>or copy and paste this URL into your browser:</Text>

      <Text className="max-w-sm flex-wrap break-words font-medium leading-snug">{url}</Text>
    </EmailWrapper>
  )
}

export default EmailLoginLink

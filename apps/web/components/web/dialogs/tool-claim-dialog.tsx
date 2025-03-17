import { getUrlHostname } from "@curiousleaf/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { useServerAction } from "zsa-react"
import { Button } from "~/components/common/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/common/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/common/form"
import { Input } from "~/components/common/input"
import { Stack } from "~/components/common/stack"
import { LoginDialog } from "~/components/web/auth/login-dialog"
import { claimsConfig } from "~/config/claims"
import { siteConfig } from "~/config/site"
import { useSession } from "~/lib/auth-client"
import { sendToolClaimOtp, verifyToolClaimOtp } from "~/server/web/tools/actions"
import type { ToolOne } from "~/server/web/tools/payloads"

type ToolClaimDialogProps = {
  tool: ToolOne
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

const otpSchema = z.object({
  otp: z.string().min(6, "Please enter a valid OTP code"),
})

export const ToolClaimDialog = ({ tool, isOpen, setIsOpen }: ToolClaimDialogProps) => {
  const { data: session } = useSession()
  const [step, setStep] = useState<"email" | "otp">("email")
  const [verificationEmail, setVerificationEmail] = useState("")
  const [cooldownRemaining, setCooldownRemaining] = useState(0)

  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  })

  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  })

  // Reset forms and state when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setStep("email")
      emailForm.reset()
      otpForm.reset()
      setVerificationEmail("")
      setCooldownRemaining(0)
    }
  }, [isOpen, emailForm, otpForm])

  // Cooldown timer effect
  useEffect(() => {
    if (cooldownRemaining <= 0) return

    const interval = setInterval(() => {
      setCooldownRemaining(prev => (prev > 0 ? prev - 1 : 0))
    }, 1000)

    return () => clearInterval(interval)
  }, [cooldownRemaining])

  const { execute: sendOtp, isPending: isSendingOtp } = useServerAction(sendToolClaimOtp, {
    onSuccess: () => {
      toast.success("OTP code sent to your email")
      setVerificationEmail(emailForm.getValues().email)
      setStep("otp")
      setCooldownRemaining(claimsConfig.resendCooldown)
    },
    onError: ({ err }) => {
      toast.error(err.message)
    },
  })

  const { execute: verifyOtp, isPending: isVerifying } = useServerAction(verifyToolClaimOtp, {
    onSuccess: () => {
      toast.success(`You've successfully claimed ${tool.name}`)
      setIsOpen(false)
    },
    onError: ({ err }) => {
      toast.error(err.message)
    },
  })

  const handleSendOtp = ({ email }: z.infer<typeof emailSchema>) => {
    const toolDomain = getUrlHostname(tool.websiteUrl)
    const emailDomain = email.split("@")[1]

    if (toolDomain !== emailDomain) {
      emailForm.setError("email", {
        type: "manual",
        message: `Email must match the website domain (${toolDomain})`,
      })

      return
    }

    sendOtp({ toolSlug: tool.slug, email })
  }

  const handleVerifyOtp = (data: z.infer<typeof otpSchema>) => {
    verifyOtp({
      toolSlug: tool.slug,
      email: verificationEmail,
      otp: data.otp,
    })
  }

  const handleResendOtp = () => {
    if (cooldownRemaining > 0 || isSendingOtp) return

    sendOtp({ toolSlug: tool.slug, email: verificationEmail })
  }

  const getResendButtonText = () => {
    if (cooldownRemaining > 0) {
      return `Resend in ${cooldownRemaining}s`
    }

    return "Resend code"
  }

  if (!session?.user) {
    return <LoginDialog isOpen={isOpen} setIsOpen={setIsOpen} />
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Claim {tool.name}</DialogTitle>
        </DialogHeader>

        {step === "email" ? (
          <Form {...emailForm}>
            <form onSubmit={emailForm.handleSubmit(handleSendOtp)} className="space-y-6">
              <DialogDescription>
                <p>
                  To claim this listing, you need to verify the ownership of the{" "}
                  <strong>{getUrlHostname(tool.websiteUrl)}</strong> domain. This helps us to ensure
                  that you represent the organization.
                </p>

                <p>
                  By claiming this tool, it will get a <strong>verified badge</strong> and you'll be
                  able to:
                </p>

                <ul className="mt-2 list-disc pl-4">
                  <li>Update tool information</li>
                  <li>Manage its categories and alternatives</li>
                  <li>Promote it on {siteConfig.name}</li>
                </ul>
              </DialogDescription>

              <FormField
                control={emailForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        data-1p-ignore
                        placeholder={`e.g. hello@${getUrlHostname(tool.websiteUrl)}`}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="secondary" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>

                <Button type="submit" className="min-w-28" isPending={isSendingOtp}>
                  Send Verification Code
                </Button>
              </DialogFooter>
            </form>
          </Form>
        ) : (
          <Form {...otpForm}>
            <form onSubmit={otpForm.handleSubmit(handleVerifyOtp)} className="space-y-6">
              <DialogDescription>
                <p>
                  We've sent a verification code to <strong>{verificationEmail}</strong>. Enter the
                  code below to complete the verification process.
                </p>
              </DialogDescription>

              <Stack direction="column">
                <FormField
                  control={otpForm.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Verification Code</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={`Enter the ${claimsConfig.otpLength}-digit code`}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Stack size="sm" className="w-full justify-between">
                  <Button
                    size="sm"
                    variant="secondary"
                    type="button"
                    onClick={() => {
                      setStep("email")
                      otpForm.reset()
                    }}
                  >
                    Change email
                  </Button>

                  <Button
                    size="sm"
                    variant="secondary"
                    type="button"
                    onClick={handleResendOtp}
                    isPending={isSendingOtp}
                    disabled={cooldownRemaining > 0}
                  >
                    {getResendButtonText()}
                  </Button>
                </Stack>
              </Stack>

              <DialogFooter>
                <Button type="button" variant="secondary" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>

                <Button type="submit" className="min-w-28" isPending={isVerifying}>
                  Claim {tool.name}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  )
}

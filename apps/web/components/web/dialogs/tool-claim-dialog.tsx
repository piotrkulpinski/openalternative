import { getUrlHostname } from "@curiousleaf/utils"
import type { Dispatch, SetStateAction } from "react"
import { toast } from "sonner"
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
import { LoginDialog } from "~/components/web/auth/login-dialog"
import { siteConfig } from "~/config/site"
import { useSession } from "~/lib/auth-client"
import type { ToolOne } from "~/server/web/tools/payloads"
import { claimTool } from "~/server/web/users/actions"

type ToolClaimDialogProps = {
  tool: ToolOne
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

export const ToolClaimDialog = ({ tool, isOpen, setIsOpen }: ToolClaimDialogProps) => {
  const { data: session } = useSession()

  const { execute, isPending } = useServerAction(claimTool, {
    onSuccess: () => {
      toast.success("You've successfully claimed this tool.")
      setIsOpen(false)
    },
    onError: ({ err }) => {
      toast.error(err.message)
    },
  })

  if (!session?.user) {
    return <LoginDialog isOpen={isOpen} setIsOpen={setIsOpen} />
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Claim {tool.name}</DialogTitle>

          <DialogDescription>
            <p>
              To claim this listing, you need to verify the ownership of the{" "}
              <strong>{getUrlHostname(tool.websiteUrl)}</strong> domain. This helps us to ensure
              that you represent the organization.
            </p>

            <p>By claiming this tool, you'll be able to:</p>

            <ul className="mt-2 list-disc pl-4">
              <li>Get a verified badge</li>
              <li>Update tool information</li>
              <li>Manage its categories and alternatives</li>
              <li>Promote it on {siteConfig.name}</li>
            </ul>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="secondary" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>

          <Button
            onClick={() => execute({ toolSlug: tool.slug })}
            className="min-w-28"
            isPending={isPending}
          >
            Claim {tool.name}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

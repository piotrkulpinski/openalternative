import { getUrlHostname } from "@curiousleaf/utils"
import { usePathname } from "next/navigation"
import type { Dispatch, SetStateAction } from "react"
import { toast } from "sonner"
import { useServerAction } from "zsa-react"
import { claimTool } from "~/actions/claim"
import { Button } from "~/components/common/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/common/dialog"
import { siteConfig } from "~/config/site"
import { useSession } from "~/lib/auth-client"
import type { ToolOne } from "~/server/web/tools/payloads"

type ToolClaimDialogProps = {
  tool: ToolOne
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

export const ToolClaimDialog = ({ tool, isOpen, setIsOpen }: ToolClaimDialogProps) => {
  const pathname = usePathname()
  const { data: session } = useSession()
  const callbackURL = `${siteConfig.url}${pathname}`

  const { execute, isPending } = useServerAction(claimTool, {
    onSuccess: () => {
      toast.success("You've successfully claimed this tool.")
      setIsOpen(false)
    },
    onError: ({ err }) => {
      toast.error(err.message)
    },
  })

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Claim {tool.name}</DialogTitle>

          <DialogDescription>
            <p>
              To claim this listing, you need to sign in with an email address from the same domain
              – <strong>{getUrlHostname(tool.websiteUrl)}</strong>. This helps us verify that you
              represent the organization.
            </p>

            <p>By claiming this tool, you'll be able to:</p>

            <ul className="mt-2 list-disc pl-4">
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
            onClick={() => execute({ toolSlug: tool.slug, callbackURL })}
            className="min-w-28"
            isPending={isPending}
          >
            {session?.user ? `Claim ${tool.name}` : "Sign in to claim"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

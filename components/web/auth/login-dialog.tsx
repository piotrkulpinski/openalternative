import type { Dispatch, SetStateAction } from "react"
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/common/dialog"
import { Dialog } from "~/components/common/dialog"
import { Login } from "~/components/web/auth/login"
import { useSession } from "~/lib/auth-client"

type LoginDialogProps = {
  description?: string
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

export const LoginDialog = ({ description, isOpen, setIsOpen }: LoginDialogProps) => {
  const { data: session } = useSession()

  if (session?.user) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-xs">
        <DialogHeader>
          <DialogTitle>Sign In</DialogTitle>

          <DialogDescription>
            <p>
              {description || "Join the open source community and get access to the dashboard."}
            </p>
          </DialogDescription>
        </DialogHeader>

        <Login />
      </DialogContent>
    </Dialog>
  )
}

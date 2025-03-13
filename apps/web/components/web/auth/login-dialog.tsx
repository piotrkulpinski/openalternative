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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-xs">
        <DialogHeader>
          <DialogTitle>Sign In</DialogTitle>

          <DialogDescription>
            <p>{description || "Get access to the dashboard and manage your submitted tools."}</p>
          </DialogDescription>
        </DialogHeader>

        <Login />
      </DialogContent>
    </Dialog>
  )
}

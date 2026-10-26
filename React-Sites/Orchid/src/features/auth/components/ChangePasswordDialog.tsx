import { useContext, useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { toast } from "react-toastify"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthContext } from "@/context/AuthContext/authContext"
import { getErrorMessage } from "@/lib/getErrorMessage"
import { changePassword } from "../auth.api"

interface ChangePasswordDialogProps {
  isOpen: boolean
  setIsOpen: (v: boolean) => void
}

export default function ChangePasswordDialog({
  isOpen,
  setIsOpen,
}: ChangePasswordDialogProps) {
  const { setToken } = useContext(AuthContext)
  const [password, setPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirm, setConfirm] = useState("")

  // Clear the fields whenever the dialog closes
  function handleOpenChange(open: boolean) {
    if (!open) {
      setPassword("")
      setNewPassword("")
      setConfirm("")
    }
    setIsOpen(open)
  }

  const { mutate, isPending } = useMutation({
    mutationFn: () => changePassword({ password, newPassword }), // json
    onSuccess: (res) => {
      const newToken = res.data?.token // old token may be invalid, store new one
      if (newToken) {
        localStorage.setItem("token", newToken)
        setToken(newToken)
      }
      toast.success("Password changed")
      handleOpenChange(false)
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })

  const mismatch = confirm.length > 0 && newPassword !== confirm
  const canSubmit =
    password.length > 0 &&
    newPassword.length >= 8 &&
    newPassword === confirm &&
    !isPending

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change password</DialogTitle>
          <DialogDescription>
            Use at least 8 characters for your new password.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="current-password">Current password</Label>
            <Input
              id="current-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="new-password">New password</Label>
            <Input
              id="new-password"
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirm-password">Confirm new password</Label>
            <Input
              id="confirm-password"
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
            {mismatch && (
              <p className="text-xs text-destructive">Passwords don't match</p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => mutate()} disabled={!canSubmit}>
            {isPending ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

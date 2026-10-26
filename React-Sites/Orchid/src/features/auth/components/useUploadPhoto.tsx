import { useRef } from "react"
import { useMutation } from "@tanstack/react-query"
import { toast } from "react-toastify"
import { getErrorMessage } from "@/lib/getErrorMessage"
import { uploadProfilePhoto } from "../auth.api"
import useInvalidateProfilePhoto from "@/hooks/useInvalidateProfilePhoto"

export function useUploadPhoto() {
  const fileRef = useRef<HTMLInputElement>(null)

  function uploadPhoto() {
    const formData = new FormData()
    const file = fileRef.current?.files?.[0]
    if (file) {
      formData.append("photo", file)
    }
    return uploadProfilePhoto(formData)
  }

  const addQuery = useInvalidateProfilePhoto()
  const { mutate, isPending } = useMutation({
    mutationFn: uploadPhoto,
    onSuccess: () => {
      toast.success("Profile photo updated")
      addQuery()
    },
    onError: (error) => toast.error(getErrorMessage(error)),
    onSettled: () => {
      if (fileRef.current) fileRef.current.value = ""
    },
  })

  const input = (
    <input
      ref={fileRef}
      type="file"
      accept="image/*"
      hidden
      onChange={(e) => {
        const file = e.target.files?.[0]
        if (file) mutate()
      }}
    />
  )

  return { input, open: () => fileRef.current?.click(), isPending }
}

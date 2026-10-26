import { useRef, useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { ImagePlus, Loader2, X } from "lucide-react"
import { toast } from "react-toastify"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import useInvalidatePosts from "@/hooks/useInvalidatePosts"
import { getErrorMessage } from "@/lib/getErrorMessage"
import type { Post } from "../posts.types"
import { updatePost } from "../posts.api"

interface Props {
  isOpen: boolean
  setIsOpen: (v: boolean) => void
  post: Post
}

export default function UpdatePost({ isOpen, setIsOpen, post }: Props) {
  const [imgPrev, setImgPrev] = useState<null | string>(post.image ?? null)
  const [removed, setRemoved] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  function addImg(e: React.ChangeEvent<HTMLInputElement>) {
    const reader = new FileReader()
    setRemoved(false)
    const isFileExist = e.target.files?.[0]
    if (isFileExist && e.target.files) {
      reader.readAsDataURL(e.target.files[0])
      reader.onload = function () {
        if (typeof reader.result === "string") {
          setImgPrev(reader.result)
        }
      }
    }
  }

  function removeImg() {
    setImgPrev(null)
    setRemoved(true)
    if (fileRef.current) fileRef.current.value = ""
  }

  function handleUpdate() {
    const formData = new FormData()
    const body = textareaRef.current?.value.trim()
    const file = fileRef.current?.files?.[0]
    if (body) {
      formData.append("body", body)
    }
    if (file) {
      formData.append("image", file)
    } else if (removed) {
      formData.append("image", "")
    }
    return updatePost(post._id, formData)
  }

  const updateQuery = useInvalidatePosts()
  const { mutate, isPending } = useMutation({
    mutationFn: handleUpdate,
    onSuccess: () => {
      updateQuery()
      setIsOpen(false)
      toast.success("Post updated successfully")
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })

  function handleSave() {
    if (!textareaRef.current?.value.trim() && !imgPrev) return // nothing left to save
    mutate()
  }

  // Discard unsaved edits whenever the dialog closes
  function handleOpenChange(open: boolean) {
    if (!open) {
      setImgPrev(post.image ?? null)
      setRemoved(false)
      if (fileRef.current) fileRef.current.value = ""
      if (textareaRef.current) textareaRef.current.value = post.body ?? ""
    }
    setIsOpen(open)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-center">Edit post</DialogTitle>
        </DialogHeader>

        <Textarea
          ref={textareaRef}
          defaultValue={post.body}
          aria-label="Post text"
          className="min-h-32 resize-none border-0 p-0 text-lg shadow-none focus-visible:ring-0"
        />

        {imgPrev ? (
          <div className="relative overflow-hidden rounded-xl border">
            <img
              src={imgPrev}
              alt=""
              className="max-h-72 w-full object-cover"
            />
            <Button
              type="button"
              variant="secondary"
              size="icon"
              aria-label="Remove image"
              className="absolute top-2 right-2 cursor-pointer rounded-full"
              onClick={removeImg}
            >
              <X className="size-4" />
            </Button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed py-6 text-sm font-semibold text-muted-foreground transition-colors hover:border-violet-400 hover:bg-violet-50 hover:text-violet-700 dark:hover:bg-violet-500/10"
          >
            <ImagePlus className="size-5" /> Add a photo
          </button>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => addImg(e)}
        />

        <Button
          className="h-11 w-full cursor-pointer bg-violet-600 font-semibold hover:bg-violet-700"
          disabled={isPending}
          onClick={handleSave}
        >
          {isPending ? <Loader2 className="animate-spin" /> : "Save changes"}
        </Button>
      </DialogContent>
    </Dialog>
  )
}

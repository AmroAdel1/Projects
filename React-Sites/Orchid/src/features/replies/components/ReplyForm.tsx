import { useRef, useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { ImagePlus, X } from "lucide-react"
import { toast } from "react-toastify"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { getErrorMessage } from "@/lib/getErrorMessage"
import useInvalidateReplies from "@/hooks/useInvalidateReplies"
import { createReply } from "../reply.api"
import type { Comment } from "@/features/comments/comments.types"

export default function ReplyForm({ comment }: { comment: Comment }) {
  const fileRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [imgPrev, setImgPrev] = useState<null | string>(null)

  function addImg(e: React.ChangeEvent<HTMLInputElement>) {
    const reader = new FileReader()
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
    if (fileRef.current) fileRef.current.value = ""
  }

  function addReply() {
    const content = textareaRef.current?.value
    const file = fileRef.current?.files?.[0]
    const formData = new FormData()
    if (content) {
      formData.append("content", content)
    }
    if (file) {
      formData.append("image", file)
    }
    return createReply(comment.post, comment._id, formData)
  }

  const addQuery = useInvalidateReplies(comment._id, comment.post)
  const { mutate, isPending } = useMutation({
    mutationFn: addReply,
    onSuccess: () => {
      addQuery()
      if (textareaRef.current) textareaRef.current.value = ""
      removeImg()
      toast.success("Reply added")
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })

  function handleReply() {
    if (!textareaRef.current?.value.trim() && !fileRef.current?.files?.[0])
      return
    mutate()
  }

  return (
    <div className="space-y-2 rounded-xl border bg-card p-3">
      <Textarea
        ref={textareaRef}
        className="min-h-16 resize-none"
        placeholder="Write a reply..."
      />
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileRef}
        onChange={(e) => addImg(e)}
      />
      {imgPrev && (
        <div className="relative w-40">
          <img src={imgPrev} alt="Preview" className="w-full rounded-lg" />
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="absolute top-1 right-1 size-6 rounded-full"
            onClick={removeImg}
            aria-label="Remove image"
          >
            <X className="size-3" />
          </Button>
        </div>
      )}
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileRef.current?.click()}
        >
          <ImagePlus />
        </Button>
        <Button
          type="button"
          size="sm"
          className="ml-auto"
          onClick={handleReply}
          disabled={isPending}
        >
          {isPending ? "Sending..." : "Reply"}
        </Button>
      </div>
    </div>
  )
}

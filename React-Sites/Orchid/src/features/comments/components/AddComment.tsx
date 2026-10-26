import { useMutation } from "@tanstack/react-query"
import { toast } from "react-toastify"
import useInvalidateComments from "@/hooks/useInvalidateComments"
import useInvalidateLikes from "@/hooks/useInvalidateLikes"
import { getErrorMessage } from "@/lib/getErrorMessage"
import { createComment } from "../comments.api"
import CommentComposer from "./CommentComposer"

export default function AddComment({ id }: { id: string }) {
  function handleAddComment({
    content,
    file,
  }: {
    content: string
    file: File | null
  }) {
    const formData = new FormData()
    formData.append("content", content)
    if (file) {
      formData.append("image", file)
    }
    return createComment(id, formData)
  }

  const refreshComments = useInvalidateComments(id)
  const refreshPosts = useInvalidateLikes(id) // also refreshes the post's comment count
  const m = useMutation({
    mutationFn: handleAddComment,
    onSuccess: () => {
      refreshComments()
      refreshPosts()
      toast.success("Comment added")
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  })
  return (
    <CommentComposer
      placeholder="Write a comment…"
      submitLabel="Comment"
      onSubmit={(content, file) => m.mutateAsync({ content, file })}
    />
  )
}

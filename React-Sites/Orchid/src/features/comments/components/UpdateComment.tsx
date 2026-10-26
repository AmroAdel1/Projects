import { useMutation } from "@tanstack/react-query"
import { toast } from "react-toastify"
import useInvalidateComments from "@/hooks/useInvalidateComments"
import { getErrorMessage } from "@/lib/getErrorMessage"
import { updateComment } from "../comments.api"
import type { Comment } from "../comments.types"
import CommentComposer from "./CommentComposer"

interface Props {
  comment: Comment
  onDone: () => void
}

export default function UpdateComment({ comment, onDone }: Props) {
  function handleUpdate({
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
    return updateComment(comment.post, comment._id, formData)
  }

  const updateQuery = useInvalidateComments(comment.post)
  const m = useMutation({
    mutationFn: handleUpdate,
    onSuccess: () => {
      updateQuery()
      toast.success("Comment updated")
      onDone()
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })

  return (
    <CommentComposer
      autoFocus
      initial={comment.content}
      existingImage={comment.image}
      placeholder="Edit your comment…"
      submitLabel="Save"
      onCancel={onDone}
      onSubmit={(content, file) => m.mutateAsync({ content, file })}
    />
  )
}

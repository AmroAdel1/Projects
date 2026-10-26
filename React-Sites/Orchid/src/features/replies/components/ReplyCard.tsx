import { useState } from "react"
import { Link } from "react-router-dom"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-toastify"
import { Heart } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import dayjs from "@/lib/dayjs"
import { getLoggedUserId } from "@/lib/getLoggedUserId"
import { getErrorMessage } from "@/lib/getErrorMessage"
import type { Reply } from "../../replies/reply.types"
import useInvalidateReplies from "@/hooks/useInvalidateReplies"
import { deleteComment, likeComment } from "@/features/comments/comments.api"
import ConfirmDelete from "@/features/comments/components/ConfirmDelete"

export default function ReplyCard({ reply }: { reply: Reply }) {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const me = getLoggedUserId()
  const author = reply.commentCreator
  const isLiked = !!me && reply.likes.includes(me)

  const queryClient = useQueryClient()
  const refreshReplies = () =>
    queryClient.invalidateQueries({
      queryKey: ["replies", reply.parentComment],
    })
  const like = useMutation({
    mutationFn: () => likeComment(reply.post, reply._id),
    onSuccess: refreshReplies,
    onError: (e) => toast.error(getErrorMessage(e)),
  })

  const removeQuery = useInvalidateReplies(reply.parentComment, reply.post)
  const remove = useMutation({
    mutationFn: () => deleteComment(reply.post, reply._id),
    onSuccess: () => {
      removeQuery()
      toast.success("Reply deleted")
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  })

  return (
    <div className="flex gap-2.5">
      <Link to={`/profile/${author._id}`} className="shrink-0">
        <Avatar className="size-7">
          <AvatarImage src={author.photo} alt="" />
          <AvatarFallback className="bg-violet-100 text-[10px] font-bold text-violet-700">
            {author.name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </Link>
      <div className="min-w-0 flex-1">
        <div className="w-fit max-w-full rounded-2xl bg-muted px-3 py-1.5">
          <Link
            to={`/profile/${author._id}`}
            className="block text-xs font-semibold hover:underline"
          >
            {author.name}
          </Link>
          <p className="text-sm leading-relaxed wrap-break-word whitespace-pre-wrap">
            {reply.content}
          </p>
        </div>
        {reply.image && (
          <img
            src={reply.image}
            alt=""
            loading="lazy"
            className="mt-2 max-h-48 rounded-xl border object-cover"
          />
        )}
        <div className="mt-0.5 flex items-center gap-4 px-1 text-xs font-semibold text-muted-foreground">
          <span className="font-normal">
            {dayjs(reply.createdAt).fromNow()}
          </span>
          <button
            type="button"
            onClick={() => like.mutate()}
            disabled={!me || like.isPending}
            aria-pressed={isLiked}
            aria-label={isLiked ? "Unlike reply" : "Like reply"}
            className={`flex cursor-pointer items-center gap-1 hover:text-foreground ${
              isLiked ? "text-rose-500 hover:text-rose-500" : ""
            }`}
          >
            <Heart className={`size-3.5 ${isLiked ? "fill-current" : ""}`} />
            {reply.likes.length > 0 && reply.likes.length}
          </button>
          {author._id === me && (
            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              className="cursor-pointer hover:text-destructive"
            >
              Delete
            </button>
          )}
        </div>
      </div>
      <ConfirmDelete
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete this reply?"
        onConfirm={() => remove.mutate()}
      />
    </div>
  )
}

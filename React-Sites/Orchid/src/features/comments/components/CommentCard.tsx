import { useState } from "react"
import { Link } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import { toast } from "react-toastify"
import { Heart, MessageCircle } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import dayjs from "@/lib/dayjs"
import { getLoggedUserId } from "@/lib/getLoggedUserId"
import { getErrorMessage } from "@/lib/getErrorMessage"
import useInvalidateComments from "@/hooks/useInvalidateComments"
import useInvalidateLikes from "@/hooks/useInvalidateLikes"
import { deleteComment, likeComment } from "../comments.api"
import type { Comment } from "../comments.types"
import UpdateComment from "./UpdateComment"
import CommentReplies from "../../replies/components/RepliesLogic"
import ConfirmDelete from "./ConfirmDelete"

export default function CommentCard({ comment }: { comment: Comment }) {
  const [isEditing, setIsEditing] = useState(false)
  const [showReplies, setShowReplies] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const me = getLoggedUserId()
  const author = comment.commentCreator
  const isOwner = author._id === me
  const isLiked = comment.likes.includes(me)

  const refreshComments = useInvalidateComments(comment.post)
  const refreshPosts = useInvalidateLikes(comment.post)

  const remove = useMutation({
    mutationFn: () => deleteComment(comment.post, comment._id),
    onSuccess: () => {
      toast.success("Comment deleted")
      refreshComments()
      refreshPosts()
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })

  const like = useMutation({
    mutationFn: () => likeComment(comment.post, comment._id),
    onSuccess: () => refreshComments(),
    onError: (error) => toast.error(getErrorMessage(error)),
  })

  const action =
    "flex items-center gap-1 transition-colors disabled:pointer-events-none"

  return (
    <div className="flex gap-2.5">
      <Link to={`/profile/${author._id}`} className="shrink-0">
        <Avatar className="size-9">
          <AvatarImage src={author.photo} alt="" />
          <AvatarFallback className="bg-violet-100 text-xs font-bold text-violet-700">
            {author.name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </Link>

      <div className="min-w-0 flex-1">
        {isEditing ? (
          <UpdateComment comment={comment} onDone={() => setIsEditing(false)} />
        ) : (
          <>
            <div className="w-fit max-w-full rounded-2xl bg-muted px-3.5 py-2">
              <Link
                to={`/profile/${author._id}`}
                className="block text-sm font-semibold hover:underline"
              >
                {author.name}
              </Link>
              <p className="text-sm leading-relaxed wrap-break-word whitespace-pre-wrap">
                {comment.content}
              </p>
            </div>

            {comment.image && (
              <img
                src={comment.image}
                alt=""
                loading="lazy"
                className="mt-2 max-h-64 rounded-xl border object-cover"
              />
            )}

            <div className="mt-1 flex items-center gap-4 px-1 text-xs font-semibold text-muted-foreground">
              <span className="font-normal">
                {dayjs(comment.createdAt).fromNow()}
              </span>

              <button
                type="button"
                onClick={() => like.mutate()}
                disabled={like.isPending}
                aria-pressed={isLiked}
                className={`${action} ${isLiked ? "text-rose-500" : "hover:text-foreground"}`}
              >
                <Heart
                  className={`size-3.5 ${isLiked ? "fill-current" : ""} cursor-pointer`}
                />
                {comment.likes.length > 0 && comment.likes.length}
              </button>

              <button
                type="button"
                onClick={() => setShowReplies(!showReplies)}
                aria-expanded={showReplies}
                className={`${action} ${showReplies ? "text-violet-600" : "hover:text-foreground"} cursor-pointer`}
              >
                <MessageCircle className="size-3.5" />
                {comment.repliesCount > 0 ? comment.repliesCount : "Reply"}
              </button>

              {isOwner && (
                <>
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className={`${action} cursor-pointer hover:text-foreground`}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmOpen(true)}
                    disabled={remove.isPending}
                    className={`${action} cursor-pointer hover:text-destructive`}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </>
        )}

        {showReplies && <CommentReplies comment={comment} />}
      </div>

      <ConfirmDelete
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete this comment?"
        onConfirm={() => remove.mutate()}
      />
    </div>
  )
}

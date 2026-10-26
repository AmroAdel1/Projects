import { Link } from "react-router-dom"
import { Heart } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import dayjs from "@/lib/dayjs"
import type { TopComment as TopCommentType } from "@/features/posts/posts.types"

export default function TopComment({ comment }: { comment: TopCommentType }) {
  const author = comment.commentCreator

  return (
    <div className="flex gap-2.5">
      <Avatar className="size-7">
        <AvatarImage src={author.photo} alt="" />
        <AvatarFallback className="bg-violet-100 text-[10px] font-bold text-violet-700">
          {author.name.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="w-fit max-w-full rounded-2xl bg-muted px-3 py-1.5">
          <p className="text-xs font-semibold">{author.name}</p>
          <p dir="auto" className="line-clamp-2 text-sm wrap-break-word">
            {comment.content}
          </p>
        </div>

        {comment.image && (
          <img
            src={comment.image}
            alt=""
            loading="lazy"
            className="mt-2 max-h-48 rounded-xl border object-cover"
          />
        )}

        <div className="mt-0.5 flex items-center gap-4 px-1 text-xs text-muted-foreground">
          <span>{dayjs(comment.createdAt).fromNow()}</span>

          {comment.likes.length > 0 && (
            <span className="flex items-center gap-1">
              <Heart className="size-3.5" /> {comment.likes.length}
            </span>
          )}

          <Link
            to={`/posts/${comment.post}`}
            className="ml-auto font-semibold text-violet-600 hover:underline"
          >
            View all comments
          </Link>
        </div>
      </div>
    </div>
  )
}

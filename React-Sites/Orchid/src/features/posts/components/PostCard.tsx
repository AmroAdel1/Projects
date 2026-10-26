import { useState } from "react"
import { Link } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import { jwtDecode } from "jwt-decode"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime.js"
import {
  Bookmark,
  EllipsisVertical,
  MessageCircle,
  Pencil,
  Share2,
  ThumbsUp,
  Trash2,
} from "lucide-react"
import { toast } from "react-toastify"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import TopComment from "@/features/comments/components/TopComment"
import useInvalidatePosts from "@/hooks/useInvalidatePosts"
import useInvalidateLikes from "@/hooks/useInvalidateLikes"
import { getErrorMessage } from "@/lib/getErrorMessage"
import type { Post } from "@/features/posts/posts.types"
import { bookmarkPost, deletePost, likePost, sharePost } from "../posts.api"
import EditPost from "./UpdatePost"
import LikesDialog from "./LikesDialog"

dayjs.extend(relativeTime)

function getLoggedUserId() {
  try {
    return jwtDecode<{ user: string }>(localStorage.getItem("token") ?? "").user
  } catch {
    return ""
  }
}

function Author({
  user,
  time,
  size = "size-10",
}: {
  user: Post["user"]
  time: string
  size?: string
}) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <Link to={`/profile/${user._id}`}>
        <Avatar className={size}>
          <AvatarImage src={user.photo} alt={user.name} />
          <AvatarFallback className="bg-violet-100 font-bold text-violet-700">
            {user.name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </Link>
      <div className="min-w-0">
        <Link
          to={`/profile/${user._id}`}
          className="block truncate text-sm font-bold hover:underline"
        >
          {user.name}
        </Link>
        <p className="truncate text-xs text-muted-foreground">
          @{user.username} · {dayjs(time).fromNow()}
        </p>
      </div>
    </div>
  )
}

interface ActionProps {
  label: string
  onClick?: () => void
  active?: boolean
  activeClass?: string
  children: React.ReactNode
}
function Action({
  label,
  onClick,
  active,
  activeClass = "text-violet-600",
  children,
}: ActionProps) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold transition-colors hover:bg-muted ${active ? activeClass : "text-muted-foreground"}`}
    >
      {children}
      <span className="hidden sm:inline">{label}</span>
    </button>
  )
}

interface Props {
  post: Post
  showTopComment?: boolean
}

export default function PostCard({ post, showTopComment }: Props) {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isLikesOpen, setIsLikesOpen] = useState(false)
  const myId = getLoggedUserId()
  const isMine = myId === post.user._id
  const isLiked = post.likes.includes(myId)

  const invalidatePosts = useInvalidatePosts()
  const invalidateLikes = useInvalidateLikes(post._id)

  const remove = useMutation({
    mutationFn: () => deletePost(post._id),
    onSuccess: () => {
      invalidatePosts()
      toast.success("Post deleted")
    },
    onError: (e: unknown) => toast.error(getErrorMessage(e)),
  })
  const like = useMutation({
    mutationFn: () => likePost(post._id),
    onSuccess: invalidateLikes,
    onError: (e: unknown) => toast.error(getErrorMessage(e)),
  })
  const bookmark = useMutation({
    mutationFn: () => bookmarkPost(post._id),
    onSuccess: invalidateLikes,
    onError: (e: unknown) => toast.error(getErrorMessage(e)),
  })
  const share = useMutation({
    mutationFn: () =>
      sharePost(post._id, "Sharing this great post @mentor_user"),
    onSuccess: () => {
      invalidateLikes()
      toast.success("Post shared successfully")
    },
    onError: (e: unknown) => toast.error(getErrorMessage(e)),
  })

  return (
    <>
      <article className="overflow-hidden rounded-2xl border bg-card">
        <header className="flex items-start justify-between gap-3 p-4 pb-2">
          <Author user={post.user} time={post.createdAt} />
          {isMine && (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    className="cursor-pointer"
                    variant="ghost"
                    size="icon"
                    aria-label="Post options"
                  >
                    <EllipsisVertical />
                  </Button>
                }
              />
              <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => setIsEditOpen(true)}
                  >
                    <Pencil className="size-4" /> Edit post
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer text-destructive"
                    onClick={() => remove.mutate()}
                  >
                    <Trash2 className="size-4" /> Delete post
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </header>

        <Link to={`/posts/${post.id}`} className="block">
          {post.body && (
            <p className="px-4 pb-3 text-[15px] leading-relaxed wrap-break-word whitespace-pre-wrap">
              {post.body}
            </p>
          )}
          {post.image && (
            <img
              src={post.image}
              alt=""
              className="max-h-[480px] w-full bg-muted object-cover"
              loading="lazy"
            />
          )}
        </Link>

        {post.sharedPost && (
          <Link
            to={`/posts/${post.sharedPost._id}`}
            className="mx-4 mb-3 block rounded-xl border bg-muted/40 p-3 transition-colors hover:bg-muted"
          >
            <Author
              user={post.sharedPost.user}
              time={post.sharedPost.createdAt}
              size="size-8"
            />
            {post.sharedPost.body && (
              <p className="mt-2 line-clamp-4 text-sm whitespace-pre-wrap">
                {post.sharedPost.body}
              </p>
            )}
            {post.sharedPost.image && (
              <img
                src={post.sharedPost.image}
                alt=""
                className="mt-2 max-h-60 w-full rounded-lg object-cover"
              />
            )}
          </Link>
        )}

        {/* Counts */}
        <div className="flex items-center justify-between px-4 pt-1 pb-2 text-sm text-muted-foreground">
          <button
            onClick={() => setIsLikesOpen(true)}
            disabled={post.likesCount === 0}
            className="enabled:hover:underline disabled:cursor-default cursor-pointer"
          >
            {post.likesCount} {post.likesCount === 1 ? "like" : "likes"}
          </button>
          <span>
            {post.commentsCount} comments · {post.sharesCount} shares
          </span>
        </div>

        {/* Actions */}
        <div className="mx-4 mb-3 grid grid-cols-4 gap-1 border-t pt-1.5">
          <Action label="Like" active={isLiked} onClick={() => like.mutate()}>
            <ThumbsUp
              className="size-[18px]"
              fill={isLiked ? "currentColor" : "none"}
            />
          </Action>
          <Link
            to={`/posts/${post.id}`}
            className="flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted"
          >
            <MessageCircle className="size-[18px]" />
            <span className="hidden sm:inline">Comment</span>
          </Link>
          <Action label="Share" onClick={() => share.mutate()}>
            <Share2 className="size-[18px]" />
          </Action>
          <Action
            label="Save"
            active={post.bookmarked}
            onClick={() => bookmark.mutate()}
          >
            <Bookmark
              className="size-[18px]"
              fill={post.bookmarked ? "currentColor" : "none"}
            />
          </Action>
        </div>

        {showTopComment && post.topComment && (
          <div className="border-t bg-muted/30 px-4 py-3">
            <TopComment comment={post.topComment} />
          </div>
        )}
      </article>

      {isMine && (
        <EditPost post={post} isOpen={isEditOpen} setIsOpen={setIsEditOpen} />
      )}
      {isLikesOpen && (
        <LikesDialog
          postId={post._id}
          open={isLikesOpen}
          onOpenChange={setIsLikesOpen}
        />
      )}
    </>
  )
}

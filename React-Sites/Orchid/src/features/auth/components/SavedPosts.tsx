import { useQuery } from "@tanstack/react-query"
import { getErrorMessage } from "@/lib/getErrorMessage"
import PostCard from "@/features/posts/components/PostCard"
import { getBookmarks } from "../auth.api"
import PostCardSkeleton from "@/features/posts/components/PostCardSkeleton"
import type { Bookmark } from "../profile.types"
import type { Post } from "@/features/posts/posts.types"

// to fix posts type
const toPost = (b: Bookmark): Post => ({
  ...b,
  sharedPost: typeof b.sharedPost === "object" ? b.sharedPost : undefined,
})

export default function SavedPosts() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["bookmarks"],
    queryFn: getBookmarks,
    select: (res) => res.data.bookmarks.map(toPost),
  })

  if (isLoading) return <PostCardSkeleton count={2} />
  if (isError) return <span className="text-sm">{getErrorMessage(error)}</span>

  if (data?.length === 0) {
    return (
      <div className="rounded-2xl border bg-card p-5 text-sm text-muted-foreground">
        Nothing saved yet.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {data?.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  )
}

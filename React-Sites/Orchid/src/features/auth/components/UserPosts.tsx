import { useQuery } from "@tanstack/react-query"
import { getErrorMessage } from "@/lib/getErrorMessage"
import PostCard from "@/features/posts/components/PostCard" // your existing component
import { getUserPosts } from "../auth.api"
import PostCardSkeleton from "@/features/posts/components/PostCardSkeleton"

export default function UserPosts({ userId }: { userId: string }) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["user-posts", userId],
    queryFn: () => getUserPosts(userId),
    select: (res) => res.data.posts,
  })

  if (isLoading) return <PostCardSkeleton count={4} />
  if (isError) return <span className="text-sm">{getErrorMessage(error)}</span>

  if (data?.length === 0) {
    return (
      <div className="rounded-2xl border bg-card p-5 text-sm text-muted-foreground">
        No posts yet.
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

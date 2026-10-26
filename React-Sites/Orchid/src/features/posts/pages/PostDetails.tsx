import { Link, useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { ChevronLeft } from "lucide-react"
import PostCardSkeleton from "../components/PostCardSkeleton"
import PostCard from "../components/PostCard"
import CommentLogic from "@/features/comments/components/CommentLogic"
import AddComment from "@/features/comments/components/AddComment"
import { getPostDetails } from "../posts.api"

export default function PostDetails() {
  const { id } = useParams()
  const { data: post, isLoading } = useQuery({
    queryKey: ["postDetails", id],
    queryFn: () => getPostDetails(id ?? ""),
    select: (res) => res.data.post,
    enabled: !!id,
  })

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <Link
        to="/posts"
        className="inline-flex items-center gap-1 text-sm font-semibold text-violet-600 hover:underline"
      >
        <ChevronLeft className="size-4" /> Back to feed
      </Link>

      {isLoading ? (
        <PostCardSkeleton count={1} />
      ) : !post ? ( // was: isError || !post
        <div
          role="alert"
          className="rounded-2xl border bg-card py-16 text-center"
        >
          <p className="font-semibold">Couldn't load this post</p>
          <p className="mt-1 text-sm text-muted-foreground">
            It may have been deleted, or you're offline.
          </p>
        </div>
      ) : (
        <>
          <PostCard post={post} />
          <section className="space-y-4 rounded-2xl border bg-card p-4 sm:p-5">
            <h2 className="font-bold">Comments</h2>
            <AddComment id={id ?? ""} />
            <CommentLogic postId={post._id} />
          </section>
        </>
      )}
    </div>
  )
}

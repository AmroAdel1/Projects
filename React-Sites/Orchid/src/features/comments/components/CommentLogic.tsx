import { useInfiniteQuery } from "@tanstack/react-query"
import { MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getErrorMessage } from "@/lib/getErrorMessage"
import { getAllComments } from "../comments.api"
import CommentCard from "./CommentCard"
import CommentCardSkeleton from "./CommentCardSkeleton"

export default function CommentLogic({ postId }: { postId: string }) {
  const {
    data,
    isLoading,
    isError,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["comments", postId],
    queryFn: ({ pageParam }) => getAllComments(pageParam, 20, postId),
    initialPageParam: 1,
    getNextPageParam: ({ meta }) => {
      const { currentPage, nextPage, numberOfPages } = meta.pagination
      return currentPage >= numberOfPages ? undefined : nextPage
    },
    enabled: !!postId,
    select: (res) => res.pages,
  })

  if (isLoading) return <CommentCardSkeleton />
  if (isError)
    return (
      <div role="alert" className="py-6 text-center text-sm">
        <p className="text-destructive">{getErrorMessage(error)}</p>
        <Button
          variant="outline"
          size="sm"
          className="mt-3"
          onClick={() => refetch()}
        >
          Try again
        </Button>
      </div>
    )

  const comments = data?.flatMap((p) => p.data.comments) ?? []
  if (comments.length === 0)
    return (
      <div className="flex flex-col items-center gap-1 py-8 text-center">
        <MessageCircle className="size-7 text-muted-foreground" />
        <p className="font-semibold">No comments yet</p>
        <p className="text-sm text-muted-foreground">
          Be the first to respond.
        </p>
      </div>
    )

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentCard key={comment._id} comment={comment} />
      ))}
      {hasNextPage && (
        <Button
          variant="ghost"
          size="sm"
          className="font-semibold text-violet-600"
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? "Loading…" : "View more comments"}
        </Button>
      )}
    </div>
  )
}

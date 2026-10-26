import { useInfiniteQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { getErrorMessage } from "@/lib/getErrorMessage"
import type { Comment } from "../../comments/comments.types"
import CommentCardSkeleton from "../../comments/components/CommentCardSkeleton"
import ReplyCard from "./ReplyCard"
import ReplyForm from "./ReplyForm"
import { getAllCommentReplies } from "../reply.api"

export default function RepliesLogic({ comment }: { comment: Comment }) {
  const {
    data,
    isLoading,
    isError,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["replies", comment._id],
    queryFn: ({ pageParam }) =>
      getAllCommentReplies(pageParam, 10, comment.post, comment._id),
    initialPageParam: 1,
    getNextPageParam: ({ meta }) => {
      const { currentPage, numberOfPages } = meta.pagination
      return currentPage < numberOfPages ? currentPage + 1 : undefined
    },
    select: (res) => res.pages,
  })

  const replies = data?.flatMap((p) => p.data.replies) ?? []

  return (
    <div className="mt-3 space-y-3 border-l-2 border-violet-200 pl-4 dark:border-violet-500/30">
      {isLoading && <CommentCardSkeleton count={1} />}
      {isError && (
        <p role="alert" className="text-sm text-destructive">
          {getErrorMessage(error)}
        </p>
      )}
      {!isLoading && !isError && replies.length === 0 && (
        <p className="text-xs text-muted-foreground">
          No replies yet. Start the conversation.
        </p>
      )}

      {replies.map((reply) => (
        <ReplyCard key={reply._id} reply={reply} />
      ))}

      {hasNextPage && (
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs font-semibold text-violet-600"
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? "Loading…" : "View more replies"}
        </Button>
      )}

      <ReplyForm comment={comment} />
    </div>
  )
}

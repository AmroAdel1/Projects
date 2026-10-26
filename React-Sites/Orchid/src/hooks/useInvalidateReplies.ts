import { useQueryClient } from "@tanstack/react-query"

export default function useInvalidateReplies(commentId: string, postId: string) {
  const queryClient = useQueryClient()
  return () => {
    queryClient.invalidateQueries({ queryKey: ["replies", commentId] })
    queryClient.invalidateQueries({ queryKey: ["comments", postId] })
  }
}

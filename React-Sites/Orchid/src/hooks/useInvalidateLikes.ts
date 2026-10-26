import { useQueryClient } from '@tanstack/react-query'

export default function useInvalidateLikes(postId: string) {
  const queryClient = useQueryClient()
  return () => {
    queryClient.invalidateQueries({ queryKey: ["allPosts"] })
    queryClient.invalidateQueries({ queryKey: ["postDetails", postId] })
    queryClient.invalidateQueries({ queryKey: ["homeFeed"] })
    queryClient.invalidateQueries({ queryKey: ["postLikes", postId] })
  }
}

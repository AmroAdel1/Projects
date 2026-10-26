import { useQueryClient } from '@tanstack/react-query'
import useInvalidatePosts from './useInvalidatePosts'

export default function useInvalidateProfilePhoto() {
  const queryClient = useQueryClient()
  const invalidatePosts = useInvalidatePosts()    // allPosts, homeFeed, user-posts, bookmarks
  return () => {
    queryClient.invalidateQueries({ queryKey: ["profile"] })        // your profile + navbar avatar
    queryClient.invalidateQueries({ queryKey: ["user-posts"] })     // your avatar on comments
    invalidatePosts() // upload creates a post                      // your avatar on posts
  }
}

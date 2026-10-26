import { useQueryClient } from '@tanstack/react-query';

export default function useInvalidatePosts() {
  const queryClient = useQueryClient()
  return () => {
    queryClient.invalidateQueries({ queryKey: ["homeFeed"] })
    queryClient.invalidateQueries({ queryKey: ["allPosts"] })
  }
}

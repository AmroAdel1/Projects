import { useQueryClient } from '@tanstack/react-query'

export default function useInvalidateFollow(userId: string) {
  const queryClient = useQueryClient()
  return () => {
    queryClient.invalidateQueries({ queryKey: ["user-profile", userId] })
    queryClient.invalidateQueries({ queryKey: ["profile"] })
    queryClient.invalidateQueries({ queryKey: ["suggestions"] })
  }
}

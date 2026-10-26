import { getNotifications, getUnreadNotifications, markAllAsRead, markAsReadNotifications } from "@/features/notifications/notifications.api"
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const notificationKeys = {
  all: ["notifications"] as const,
  list: (unread: boolean) => ["notifications", "list", unread] as const,
  unreadCount: ["notifications", "unread-count"] as const,
}

export function useNotifications(unread: boolean, limit = 10) {
  return useInfiniteQuery({
    queryKey: notificationKeys.list(unread),
    queryFn: ({ pageParam }) => getNotifications(unread, pageParam, limit),
    initialPageParam: 1,
    getNextPageParam: ({ meta }) => {
      const { currentPage, numberOfPages } = meta.pagination
      return currentPage < numberOfPages ? currentPage + 1 : undefined
    },
  })
}

export function useUnreadCount() {
  return useQuery({
    queryKey: notificationKeys.unreadCount,
    queryFn: getUnreadNotifications,
    select: (res) => res.data.unreadCount,
    refetchInterval: 30_000, // light polling
    refetchOnWindowFocus: true,
  })
}

export function useMarkAsRead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: markAsReadNotifications,
    onSuccess: () => qc.invalidateQueries({ queryKey: notificationKeys.all }),
  })
}

export function useMarkAllAsRead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: markAllAsRead,
    onSuccess: () => qc.invalidateQueries({ queryKey: notificationKeys.all }),
  })
}
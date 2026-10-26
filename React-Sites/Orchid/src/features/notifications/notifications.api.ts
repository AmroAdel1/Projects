import api from "@/api/axios"
import type {
  AllMarkAllNotificationAsReadResponse,
  AllMarkNotificationAsReadResponse,
  AllNotificationsResponse,
  AllUnreadNotificationsResponse,
} from "./notifications.types"

export async function getNotifications(unread: boolean, page: number, limit: number) {
  const { data } = await api.get<AllNotificationsResponse>("/notifications", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    },
    params: { unread, limit, page, sort: "-createdAt" },
  })
  return data
}

export async function getUnreadNotifications() {
  const { data } = await api.get<AllUnreadNotificationsResponse>("/notifications/unread-count", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    },
  })
  return data
}

export async function markAsReadNotifications(id: string) {
  const { data } = await api.patch<AllMarkNotificationAsReadResponse>(`/notifications/${id}/read`, null, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    },
  })
  return data
}

export async function markAllAsRead() {
  const { data } = await api.patch<AllMarkAllNotificationAsReadResponse>("/notifications/read-all", null, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    },
  })
  return data
}
import type { IconType } from "react-icons"
import { FiBell, FiHeart, FiMessageCircle, FiShare2, FiUserPlus } from "react-icons/fi"
import dayjs from "@/lib/dayjs"
import type { Notification } from "@/features/notifications/notifications.types"

export function describe(n: Notification) {
  const t = n.type.toLowerCase()
  if (t.includes("like")) return `liked your ${n.entityType?.toLowerCase() || "post"}`
  if (t.includes("comment") || t.includes("reply")) return "commented on your post"
  if (t.includes("share")) return "shared your post"
  if (t.includes("follow")) return "started following you"
  return n.type.replace(/_/g, " ").toLowerCase()
}

export function typeBadge(n: Notification): { Icon: IconType; className: string } {
  const t = n.type.toLowerCase()
  if (t.includes("like")) return { Icon: FiHeart, className: "bg-rose-500" }
  if (t.includes("comment") || t.includes("reply")) return { Icon: FiMessageCircle, className: "bg-emerald-500" }
  if (t.includes("share")) return { Icon: FiShare2, className: "bg-amber-500" }
  if (t.includes("follow")) return { Icon: FiUserPlus, className: "bg-violet-600" }
  return { Icon: FiBell, className: "bg-slate-500" }
}

// Where a notification should take the user
export function routeFor(n: Notification): string | null {
  if (n.type.toLowerCase().includes("follow")) return `/profile/${n.actor._id}`
  if (n.entity?.unavailable) return null
  const postId = n.entityType?.toLowerCase().includes("comment") ? (n.entity?.topComment?.post ?? n.entityId) : n.entityId
  return postId ? `/posts/${postId}` : null
}

export const timeAgo = (iso: string) => dayjs(iso).fromNow()
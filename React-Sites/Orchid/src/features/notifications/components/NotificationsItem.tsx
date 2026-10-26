import { useState } from "react"
import type { Notification } from "../notifications.types"
import { describe, timeAgo, typeBadge } from "@/lib/notifications"
export default function NotificationItem({
  n,
  onOpen,
  compact,
}: {
  n: Notification
  onOpen: (n: Notification) => void
  compact?: boolean
}) {
  const [failed, setFailed] = useState(false)
  const size = compact ? "size-10" : "size-11"
  const { Icon, className: badgeClass } = typeBadge(n)

  return (
    <button
      onClick={() => onOpen(n)}
      className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors cursor-pointer hover:bg-muted ${n.isRead ? "" : "bg-violet-50/70 dark:bg-violet-500/10"}`}
    >
      <span className="relative shrink-0">
        <span
          className={`grid ${size} place-items-center overflow-hidden rounded-full bg-violet-100 font-bold text-violet-700 dark:bg-violet-500/20 dark:text-violet-300`}
        >
          {n.actor?.photo && !failed ? (
            <img
              src={n.actor.photo}
              alt=""
              onError={() => setFailed(true)}
              className="size-full object-cover"
            />
          ) : (
            (n.actor?.name?.[0]?.toUpperCase() ?? "?")
          )}
        </span>
        <span
          aria-hidden
          className={`absolute -right-1 -bottom-1 grid size-5 place-items-center rounded-full border-2 border-card text-[10px] text-white ${badgeClass}`}
        >
          <Icon />
        </span>
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-sm">
          <strong className="font-semibold">{n.actor?.name}</strong>{" "}
          {describe(n)}
        </span>
        {n.entity?.body && !n.entity.unavailable && (
          <span className="mt-0.5 block truncate text-sm text-muted-foreground">
            {n.entity.body}
          </span>
        )}
        <span
          className={`mt-0.5 block text-xs ${n.isRead ? "text-muted-foreground" : "font-semibold text-violet-600 dark:text-violet-300"}`}
        >
          {timeAgo(n.createdAt)}
        </span>
      </span>

      {!n.isRead && (
        <span
          className="mt-2 size-2.5 shrink-0 rounded-full bg-violet-600"
          aria-label="Unread"
        />
      )}
    </button>
  )
}

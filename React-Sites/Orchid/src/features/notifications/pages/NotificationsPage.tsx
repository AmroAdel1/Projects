import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { FiBell, FiCheck } from "react-icons/fi"
import { Button } from "@/components/ui/button"
import {
  useMarkAllAsRead,
  useMarkAsRead,
  useNotifications,
  useUnreadCount,
} from "@/hooks/useNotifications"
import type { Notification } from "../notifications.types"
import NotificationSkeleton from "../components/NotificationSkeleton"
import NotificationItem from "../components/NotificationsItem"
import { routeFor } from "@/lib/notifications"

const TABS = [
  { label: "All", unread: false },
  { label: "Unread", unread: true },
]

export default function NotificationsPage() {
  const navigate = useNavigate()
  const [onlyUnread, setOnlyUnread] = useState(false)

  const { data: unreadCount = 0 } = useUnreadCount()
  const list = useNotifications(onlyUnread, 15)
  const markRead = useMarkAsRead()
  const markAll = useMarkAllAsRead()
  const items = list.data?.pages.flatMap((p) => p.data.notifications) ?? []

  function open(n: Notification) {
    if (!n.isRead) markRead.mutate(n._id)
    const to = routeFor(n)
    if (to) navigate(to)
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-6">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <h1 className="text-xl font-bold">Notifications</h1>
        <Button
          variant="ghost"
          size="sm"
          className="cursor-pointer"
          onClick={() => markAll.mutate()}
          disabled={unreadCount === 0 || markAll.isPending}
        >
          <FiCheck /> Mark all as read
        </Button>
      </div>

      {/* Tabs */}
      <div className="mb-3 flex gap-1" role="tablist">
        {TABS.map((tab) => (
          <button
            key={tab.label}
            role="tab"
            aria-selected={onlyUnread === tab.unread}
            onClick={() => setOnlyUnread(tab.unread)}
            className={`cursor-pointer rounded-xl px-3 py-1.5 text-sm font-semibold transition-colors ${
              onlyUnread === tab.unread
                ? "bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {tab.label}
            {tab.unread && unreadCount > 0 ? ` (${unreadCount})` : ""}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="overflow-hidden rounded-2xl border bg-card">
        {list.isLoading && <NotificationSkeleton count={6} />}

        {list.isError && (
          <p className="p-8 text-center text-sm text-destructive">
            Couldn’t load notifications.{" "}
            <button className="underline" onClick={() => list.refetch()}>
              Try again
            </button>
          </p>
        )}

        {!list.isLoading && !list.isError && items.length === 0 && (
          <div className="grid place-items-center gap-2 p-10 text-center text-muted-foreground">
            <FiBell className="size-6" />
            <p className="text-sm">
              {onlyUnread ? "You’re all caught up." : "No notifications yet."}
            </p>
          </div>
        )}

        <div className="divide-y">
          {items.map((n) => (
            <NotificationItem key={n._id} n={n} onOpen={open} />
          ))}
        </div>

        {list.hasNextPage && (
          <div className="border-t p-3 text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => list.fetchNextPage()}
              disabled={list.isFetchingNextPage}
            >
              {list.isFetchingNextPage ? "Loading…" : "Load more"}
            </Button>
          </div>
        )}
      </div>
    </main>
  )
}

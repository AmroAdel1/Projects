import { useEffect, useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FiBell, FiCheck } from "react-icons/fi"
import { Button } from "@/components/ui/button"
import {
  useMarkAllAsRead,
  useMarkAsRead,
  useNotifications,
  useUnreadCount,
} from "@/hooks/useNotifications"
import type { Notification } from "../notifications.types"
import NotificationSkeleton from "./NotificationSkeleton"
import { routeFor } from "@/lib/notifications"
import NotificationItem from "./NotificationsItem"

const TABS = [
  { label: "All", unread: false },
  { label: "Unread", unread: true },
]

export default function NotificationBell() {
  const [open, setOpen] = useState(false)
  const [onlyUnread, setOnlyUnread] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const { data: unreadCount = 0 } = useUnreadCount()
  const list = useNotifications(onlyUnread, 10)
  const markRead = useMarkAsRead()
  const markAll = useMarkAllAsRead()
  const items = list.data?.pages.flatMap((p) => p.data.notifications) ?? []

  // Close when clicking outside the bell
  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", close)
    return () => document.removeEventListener("mousedown", close)
  }, [])

  function handleOpen(n: Notification) {
    if (!n.isRead) markRead.mutate(n._id)
    setOpen(false)
    const to = routeFor(n)
    if (to) navigate(to)
  }

  return (
    <div ref={ref} className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
        className="relative cursor-pointer"
      >
        <FiBell className="size-[18px]" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-rose-500 px-1 text-xs font-semibold text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </Button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-96 max-w-[92vw] overflow-hidden rounded-2xl border bg-popover text-popover-foreground shadow-xl">
          <div className="flex items-center justify-between px-4 pt-3 pb-1">
            <h2 className="text-base font-bold">Notifications</h2>
            <button
              onClick={() => markAll.mutate()}
              disabled={unreadCount === 0 || markAll.isPending}
              className="flex cursor-pointer items-center gap-1 text-sm font-semibold text-violet-600 disabled:cursor-not-allowed disabled:text-muted-foreground"
            >
              <FiCheck /> Mark all read
            </button>
          </div>

          <div className="flex gap-1 px-4 py-2" role="tablist">
            {TABS.map((tab) => (
              <button
                key={tab.label}
                role="tab"
                aria-selected={onlyUnread === tab.unread}
                onClick={() => setOnlyUnread(tab.unread)}
                className={`cursor-pointer rounded-full px-3 py-1 text-sm font-semibold transition-colors ${
                  onlyUnread === tab.unread
                    ? "bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="max-h-[26rem] overflow-y-auto border-t">
            {list.isLoading && <NotificationSkeleton />}

            {list.isError && (
              <p className="px-4 py-8 text-center text-sm text-destructive">
                Couldn’t load notifications.{" "}
                <button className="underline" onClick={() => list.refetch()}>
                  Try again
                </button>
              </p>
            )}

            {!list.isLoading && !list.isError && items.length === 0 && (
              <div className="grid place-items-center gap-2 px-4 py-10 text-muted-foreground">
                <FiBell className="size-6" />
                <p className="text-sm">
                  {onlyUnread
                    ? "You’re all caught up."
                    : "No notifications yet."}
                </p>
              </div>
            )}

            <div className="divide-y">
              {items.map((n) => (
                <NotificationItem
                  key={n._id}
                  n={n}
                  onOpen={handleOpen}
                  compact
                />
              ))}
            </div>

            {list.hasNextPage && (
              <div className="border-t p-2 text-center">
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

          <Link
            to="/notifications"
            onClick={() => setOpen(false)}
            className="block border-t px-4 py-2.5 text-center text-sm font-semibold text-violet-600 hover:bg-muted"
          >
            See all notifications
          </Link>
        </div>
      )}
    </div>
  )
}

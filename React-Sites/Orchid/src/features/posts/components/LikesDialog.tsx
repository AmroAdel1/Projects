import { useEffect } from "react"
import { Link } from "react-router-dom"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useInView } from "react-intersection-observer"
import Skeleton from "react-loading-skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { getPostLikes } from "../posts.api"

interface Props {
  postId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function LikesDialog({ postId, open, onOpenChange }: Props) {
  const { data, fetchNextPage, hasNextPage, isLoading, isError } =
    useInfiniteQuery({
      queryKey: ["postLikes", postId],
      queryFn: ({ pageParam }) => getPostLikes(postId, pageParam, 20),
      initialPageParam: 1,
      getNextPageParam: ({ meta }) => {
        const { currentPage, numberOfPages, nextPage } = meta.pagination
        return currentPage >= numberOfPages ? undefined : nextPage
      },
      enabled: open,
      select: (res) => res.pages,
    })

  const [ref, inView] = useInView()
  useEffect(() => {
    if (inView && hasNextPage) fetchNextPage()
  }, [inView, hasNextPage, fetchNextPage])

  const likers = data?.flatMap((p) => p.data.likes) ?? []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[70vh] overflow-y-auto sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>People who liked this</DialogTitle>
        </DialogHeader>

        {isLoading &&
          Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton circle width={40} height={40} />
              <div className="flex-1">
                <Skeleton width="50%" />
                <Skeleton width="30%" />
              </div>
            </div>
          ))}
        {isError && (
          <p className="text-sm text-destructive">Couldn't load likes.</p>
        )}
        {!isLoading && !isError && likers.length === 0 && (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No likes yet.
          </p>
        )}

        {likers.map((u) => (
          <Link
            key={u._id}
            to={`/profile/${u._id}`}
            onClick={() => onOpenChange(false)}
            className="-mx-2 flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-muted"
          >
            <Avatar>
              <AvatarImage src={u.photo} alt="" />
              <AvatarFallback className="bg-violet-100 font-bold text-violet-700">
                {u.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{u.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                @{u.username} · {u.followersCount} followers
              </p>
            </div>
          </Link>
        ))}
        <div ref={ref} className="h-1" />
      </DialogContent>
    </Dialog>
  )
}

import { useEffect, useState } from "react"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { useInView } from "react-intersection-observer"
import { AlertCircle, Newspaper } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { getErrorMessage } from "@/lib/getErrorMessage"
import type { AllPostsResponse } from "../posts.types"
import PostCard from "./PostCard"
import PostCardSkeleton from "./PostCardSkeleton"
import { AddPost } from "./AddPost"
import { getProfile } from "@/features/auth/auth.api"
import { Link } from "react-router-dom"

interface Props {
  queryKey: string[]
  queryFn: (page: number) => Promise<AllPostsResponse>
  emptyText: string
}

export default function Feed({ queryKey, queryFn, emptyText }: Props) {
  const [isAddOpen, setIsAddOpen] = useState(false)

  const me = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    select: (res) => res.data.user,
  })

  const q = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) => queryFn(pageParam),
    initialPageParam: 1,
    getNextPageParam: ({ meta }) => {
      const { currentPage, numberOfPages } = meta.pagination
      return currentPage < numberOfPages ? currentPage + 1 : undefined
    },
  })

  const { ref, inView } = useInView({ rootMargin: "300px" })
  const { hasNextPage, isFetchingNextPage, fetchNextPage } = q
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) fetchNextPage()
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  const posts = q.data?.pages.flatMap((p) => p.data.posts) ?? []

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      {/* Composer */}
      <div className="flex items-center gap-3 rounded-2xl border bg-card p-4">
        <Link to={`/profile/${me.data?._id}`}>
          <Avatar>
            <AvatarImage src={me.data?.photo} alt="" />
            <AvatarFallback className="bg-violet-100 font-bold text-violet-700">
              {me.data?.name?.[0]?.toUpperCase() ?? "?"}
            </AvatarFallback>
          </Avatar>
        </Link>
        <button
          onClick={() => setIsAddOpen(true)}
          className="flex-1 cursor-pointer rounded-full bg-muted px-4 py-2.5 text-left text-muted-foreground transition-colors hover:bg-accent"
        >
          What's on your mind
          {me.data?.name ? `, ${me.data.name.split(" ")[0]}` : ""}?
        </button>
      </div>
      <AddPost isOpen={isAddOpen} setIsOpen={setIsAddOpen} />

      {q.isLoading ? (
        <PostCardSkeleton />
      ) : q.isError && posts.length === 0 ? (
        <div
          role="alert"
          className="flex flex-col items-center gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center"
        >
          <AlertCircle className="size-8 text-destructive" />
          <p className="font-semibold">Couldn't load posts</p>
          <p className="text-sm text-muted-foreground">
            {getErrorMessage(q.error)}
          </p>
          <Button variant="outline" onClick={() => q.refetch()}>
            Try again
          </Button>
        </div>
      ) : posts.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-2xl border bg-card py-16 text-center">
          <Newspaper className="size-8 text-muted-foreground" />
          <p className="font-semibold">Nothing here yet</p>
          <p className="text-sm text-muted-foreground">{emptyText}</p>
        </div>
      ) : (
        <>
          {q.isError && (
            <p
              role="status"
              className="rounded-xl bg-amber-50 px-4 py-2 text-sm text-amber-900 dark:bg-amber-500/10 dark:text-amber-200"
            >
              Couldn't refresh. Showing saved posts.{" "}
              <button
                className="font-semibold underline"
                onClick={() => q.refetch()}
              >
                Retry
              </button>
            </p>
          )}
          {posts.map((post) => (
            <PostCard key={post._id} post={post} showTopComment />
          ))}
          <div ref={ref}>
            {isFetchingNextPage && <PostCardSkeleton count={1} />}
          </div>
          {!hasNextPage && (
            <p className="py-4 text-center text-xs text-muted-foreground">
              You're all caught up
            </p>
          )}
        </>
      )}
    </div>
  )
}

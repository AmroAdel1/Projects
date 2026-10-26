import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useInView } from "react-intersection-observer"
import Skeleton from "react-loading-skeleton"
import { FiSearch, FiUsers, FiX } from "react-icons/fi"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getErrorMessage } from "@/lib/getErrorMessage"
import FollowButton from "../components/FollowButton"
import { getFollowSuggestions } from "../auth.api"

const MAX_SEARCH_PAGES = 10 // stop loading more for a search after this many pages

export default function FollowPage() {
  const [search, setSearch] = useState("")
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    isFetchNextPageError,
  } = useInfiniteQuery({
    queryKey: ["suggestions", "page"], // starts with "suggestions", so following someone refreshes it
    queryFn: ({ pageParam }) => getFollowSuggestions(12, pageParam),
    initialPageParam: 1,
    // Only continue if the server actually returned the page we asked for
    getNextPageParam: ({ meta }, _pages, lastPageParam) => {
      const { currentPage, numberOfPages } = meta.pagination
      return currentPage === lastPageParam && currentPage < numberOfPages
        ? currentPage + 1
        : undefined
    },
  })

  const term = search.trim().toLowerCase()
  const canLoadMore =
    hasNextPage && !isFetchingNextPage && !isFetchNextPageError

  // Normal scrolling loads more; an active search loads everything so no match is missed
  const { ref, inView } = useInView({ rootMargin: "300px" })
  useEffect(() => {
    const searchBudgetLeft = (data?.pages.length ?? 0) < MAX_SEARCH_PAGES
    if (canLoadMore && (inView || (term && searchBudgetLeft))) fetchNextPage()
  }, [inView, term, canLoadMore, data?.pages.length, fetchNextPage])

  const people = data?.pages.flatMap((p) => p.data.suggestions) ?? []
  const results = term
    ? people.filter(
        (user) =>
          user.name.toLowerCase().includes(term) ||
          user.username.toLowerCase().includes(term)
      )
    : people

  // "Searching" only while a request is running or about to run
  const stillSearching =
    !!term &&
    (isFetchingNextPage ||
      (canLoadMore && (data?.pages.length ?? 0) < MAX_SEARCH_PAGES))
  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">
          People you may know
        </h1>
        <p className="text-sm text-muted-foreground">
          Follow people to see their posts in your feed.
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <FiSearch
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          type="search"
          aria-label="Search people"
          placeholder="Search by name or username"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-11 pr-10 pl-9 [&::-webkit-search-cancel-button]:hidden"
        />
        {search && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => setSearch("")}
            className="absolute top-1/2 right-2 grid size-7 -translate-y-1/2 place-items-center rounded-full text-muted-foreground hover:bg-muted"
          >
            <FiX />
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="rounded-2xl border bg-card p-5">
              <Skeleton circle width={80} height={80} className="mx-auto" />
              <Skeleton className="mt-3" />
              <Skeleton width="60%" />
              <Skeleton height={36} className="mt-3" />
            </div>
          ))}
        </div>
      ) : isError && people.length === 0 ? (
        <div
          role="alert"
          className="rounded-2xl border bg-card py-16 text-center"
        >
          <p className="font-semibold">Couldn't load suggestions</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {getErrorMessage(error)}
          </p>
          <Button variant="outline" className="mt-4" onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      ) : people.length === 0 ? (
        <div className="grid place-items-center gap-2 rounded-2xl border bg-card py-16 text-center text-muted-foreground">
          <FiUsers className="size-7" />
          <p className="font-semibold text-foreground">
            No suggestions right now
          </p>
          <p className="text-sm">
            Check back later, or follow people from the feed.
          </p>
        </div>
      ) : results.length === 0 ? (
        <div className="grid place-items-center gap-2 rounded-2xl border bg-card py-16 text-center text-muted-foreground">
          <FiSearch className="size-7" />
          {stillSearching ? (
            <p className="text-sm">Searching more people…</p>
          ) : (
            <>
              <p className="font-semibold text-foreground">
                No results for "{search.trim()}"
              </p>
              <p className="text-sm">
                Try a different name, or search only within people suggested to
                you.
              </p>
              <Button variant="outline" size="sm" onClick={() => setSearch("")}>
                Clear search
              </Button>
            </>
          )}
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((user) => (
              <div
                key={user._id}
                className="flex flex-col items-center rounded-2xl border bg-card p-5 text-center"
              >
                <Link
                  to={`/profile/${user._id}`}
                  className="flex flex-col items-center"
                >
                  <Avatar className="size-20">
                    <AvatarImage src={user.photo} alt="" />
                    <AvatarFallback className="bg-violet-100 text-xl font-bold text-violet-700">
                      {user.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <p className="mt-3 max-w-full truncate font-semibold hover:underline">
                    {user.name}
                  </p>
                  <p className="max-w-full truncate text-sm text-muted-foreground">
                    @{user.username}
                  </p>
                </Link>
                <p className="mt-1 h-4 text-xs text-muted-foreground">
                  {user.mutualFollowersCount > 0
                    ? `${user.mutualFollowersCount} mutual followers`
                    : ""}
                </p>
                <div className="mt-3 w-full [&>button]:w-full">
                  <FollowButton userId={user._id} />
                </div>
              </div>
            ))}
          </div>

          <div ref={ref} className="h-8">
            {isFetchingNextPage && <Skeleton height={32} />}
          </div>
        </>
      )}
    </div>
  )
}

import Skeleton from "react-loading-skeleton"

export default function PostCardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="my-6 overflow-hidden rounded-2xl border bg-card"
          aria-busy="true"
          aria-label="Loading post"
        >
          <div className="flex items-center gap-3 p-4">
            <Skeleton circle width={40} height={40} />
            <div className="flex-1">
              <Skeleton width="35%" />
              <Skeleton width="22%" />
            </div>
          </div>
          <div className="px-4 pb-3">
            <Skeleton count={2} />
            <Skeleton width="60%" />
          </div>
          <Skeleton height={220} borderRadius={0} />
          <div className="grid grid-cols-4 gap-2 p-3">
            <Skeleton height={32} />
            <Skeleton height={32} />
            <Skeleton height={32} />
            <Skeleton height={32} />
          </div>
        </div>
      ))}
    </>
  )
}

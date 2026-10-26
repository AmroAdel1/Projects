import Skeleton from "react-loading-skeleton"

export default function CommentCardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading comments">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="flex gap-2.5">
          <Skeleton circle width={36} height={36} />
          <div className="flex-1">
            <div className="w-3/4 rounded-2xl bg-muted/60 px-3.5 py-2">
              <Skeleton width={90} />
              <Skeleton count={2} />
            </div>
            <div className="mt-1 flex gap-4 px-1">
              <Skeleton width={36} />
              <Skeleton width={28} />
              <Skeleton width={28} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

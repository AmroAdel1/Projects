import Skeleton from "react-loading-skeleton"

export default function NotificationSkeleton({
  count = 4,
}: {
  count?: number
}) {
  return (
    <div aria-busy="true" aria-label="Loading notifications">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="flex items-start gap-3 px-4 py-3">
          <Skeleton circle width={44} height={44} />
          <div className="flex-1">
            <Skeleton width="75%" />
            <Skeleton width="40%" />
          </div>
        </div>
      ))}
    </div>
  )
}

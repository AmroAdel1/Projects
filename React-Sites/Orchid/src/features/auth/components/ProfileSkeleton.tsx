import Skeleton from "react-loading-skeleton"

export default function ProfileSkeleton() {
  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-2xl border bg-card">
        <Skeleton height={220} borderRadius={0} />
        <div className="-mt-16 flex items-end gap-4 px-8 pb-6">
          <Skeleton circle width={128} height={128} />
          <div className="flex-1 pb-2">
            <Skeleton width="40%" height={28} />
            <Skeleton width="25%" />
          </div>
        </div>
      </div>
      <Skeleton height={140} className="rounded-2xl" count={2} />
    </div>
  )
}

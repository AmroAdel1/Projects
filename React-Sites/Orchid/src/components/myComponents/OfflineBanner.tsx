import { FiWifiOff } from "react-icons/fi"
import { useNetworkState } from "react-use"

export default function OfflineBanner() {
  const { online } = useNetworkState()
  if (online) return null
  return (
    <div
      role="status"
      className="flex items-center justify-center gap-2 bg-amber-500 px-4 py-1.5 text-center text-sm font-semibold text-amber-950"
    >
      <FiWifiOff /> You're offline. Showing saved posts.
    </div>
  )
}

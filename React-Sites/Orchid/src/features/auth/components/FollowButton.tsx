import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { toast } from "react-toastify"
import { Button } from "@/components/ui/button"
import { getErrorMessage } from "@/lib/getErrorMessage"
import { followUser } from "../auth.api"
import { getLoggedUserId } from "@/lib/getLoggedUserId"
import useInvalidateFollow from "@/hooks/useInvalidateFollow"

type Props = {
  userId: string
  isFollowing?: boolean
}
export default function FollowButton({ userId, isFollowing = false }: Props) {
  const [following, setFollowing] = useState(isFollowing)

  const addQuery = useInvalidateFollow(userId)
  const { mutate, isPending } = useMutation({
    mutationFn: () => followUser(userId),
    onSuccess: (res) => {
      setFollowing(res.data.following)
      addQuery()
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })

  if (userId === getLoggedUserId()) return null // can't follow yourself

  return (
    <Button
      size="default"
      variant={following ? "outline" : "default"}
      className={`${
        following ? "" : "bg-violet-600 text-white hover:bg-violet-700"
      } cursor-pointer`}
      onClick={() => mutate()}
      disabled={isPending}
    >
      {isPending ? "..." : following ? "Following" : "Follow"}
    </Button>
  )
}

import Feed from "../components/Feed"
import { getHomeFeed } from "../posts.api"

export default function HomeFeedPage() {
  return (
    <Feed
      queryKey={["homeFeed"]}
      queryFn={getHomeFeed}
      emptyText="Follow some people and their posts will show up here."
    />
  )
}

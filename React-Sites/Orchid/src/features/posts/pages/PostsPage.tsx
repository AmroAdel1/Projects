import Feed from "../components/Feed"
import { getAllPosts } from "../posts.api"

export default function PostsPage() {
  return (
    <Feed
      queryKey={["allPosts"]}
      queryFn={(page) => getAllPosts(page, 10)}
      emptyText="Be the first to share something."
    />
  )
}

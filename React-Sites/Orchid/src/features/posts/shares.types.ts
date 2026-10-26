import type { TopComment } from "./posts.types"

export interface AllSharesResponse {
  success: boolean
  message: string
  data: SharesData
}

export interface SharesData {
  post: SharedPost
}

export interface SharedPost {
  _id: string
  body: string
  privacy: string
  user: User
  sharedPost: SharedPost
  likes: string[]
  createdAt: string
  commentsCount: number
  topComment: TopComment
  sharesCount: number
  likesCount: number
  isShare: boolean
  id: string
}

export interface User {
  _id: string
  name: string
  username: string
  photo: string
  followersCount: number
  followingCount: number
  bookmarksCount: number
  id: string
}



// get post likes
export interface AllLikesResponse {
  success: boolean
  message: string
  data: LikesData
  meta: Meta
}

export interface LikesData {
  likes: Like[]
}

export interface Like {
  _id: string
  name: string
  username: string
  photo: string
  followersCount: number  
  followingCount: number
  bookmarksCount: number
  id: string
}

export interface Meta {
  pagination: Pagination
}

export interface Pagination {
  currentPage: number
  limit: number
  total: number
  numberOfPages: number
  nextPage: number
}

// like/unlike post
export interface LikePostResponse {
  success: boolean
  message: string
  data: LikePostData
}

export interface LikePostData {
  liked: boolean
  likesCount: number
  post: Post
}

export interface Post {
  _id: string
  body: string
  privacy: string
  user: User
  sharedPost: Post
  likes: string[]
  createdAt: string
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

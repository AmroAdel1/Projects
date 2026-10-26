export interface AllPostsResponse {
  success: boolean
  message: string
  data: PostsData
  meta: Meta
}

export interface PostsData {
  posts: Post[]
}

export interface Post {
  _id: string
  body?: string
  image?: string
  privacy: string
  user: User
  sharedPost?: Post
  likes: string[]
  createdAt: string
  commentsCount: number
  topComment?: TopComment
  sharesCount: number
  likesCount: number
  isShare: boolean
  id: string
  bookmarked: boolean
}

export interface User {
  _id: string
  name: string
  username: string
  photo: string
}

export interface TopComment {
  _id: string
  image?: string
  content: string
  commentCreator: CommentCreator
  post: string
  parentComment?: string
  likes: string[]
  createdAt: string
}

export interface CommentCreator {
  _id: string
  name: string
  username: string
  photo: string
}

export interface Meta {
  pagination: Pagination
}

export interface Pagination {
  currentPage: number
  numberOfPages: number
  limit: number
  nextPage: number
  total: number
}

// get post details 
export interface PostDetailsResponse {
  success: boolean
  message: string
  data: {
    post: Post
  }
}

// get feed
export interface FeedMeta {
  feedMode: string
  pagination: FeedPagination
}

export interface FeedPagination {
  currentPage: number
  limit: number
  total: number
  numberOfPages: number
}
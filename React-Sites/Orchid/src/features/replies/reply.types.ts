export interface AllRepliesResponse {
  success: boolean
  message: string
  data: ReplyData
  meta: Meta
}

export interface ReplyData {
  replies: Reply[]
}

export interface Reply {
  _id: string
  content: string
  commentCreator: CommentCreator
  post: string
  parentComment: string
  likes: string[]
  createdAt: string
  likesCount: number
  isReply: boolean
  id: string
  image: string
}

export interface CommentCreator {
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
}


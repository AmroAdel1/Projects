/**
 * Successful response from `GET /posts/:postId/comments`.
 * Returns a paginated list of top-level comments for a post.
 */
export interface AllCommentsData {
  success: boolean
  message: string
  data: CommentsData
  meta: Meta
}

export interface CommentsData {
  comments: Comment[]
}

export interface Comment {
  _id: string
  content: string
  commentCreator: CommentCreator
  post: string
  parentComment: string
  likes: string[]
  createdAt: string
  repliesCount: number
  image?: string
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
  limit: number
  total: number
  numberOfPages: number
  nextPage: number
}

/**
 * Error response returned by the API when a request fails
 * (e.g. `400 Bad Request` for an invalid post ID, `401 Unauthorized` for a missing token).
 */
export interface ErrorResponse {
  success: boolean
  message: string
  errors: string
}

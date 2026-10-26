export interface AllLikesResponse {
  success: boolean
  message: string
  data: LikesCommentsData
}

export interface LikesCommentsData {
  liked: boolean
  likesCount: number
  comment: Comment
}

export interface Comment {
  _id: string
  content: string
  commentCreator: CommentCreator
  post: string
  parentComment: string
  likes: string[]
  createdAt: string
  image: string
  likesCount: number
  isReply: boolean
  id: string
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

// export interface AllNotificationsResponse {
//   success: boolean
//   message: string
//   data: NotificationsData
//   meta: Meta
// }

// export interface NotificationsData {
//   notifications: Notification[]
// }

// export interface Notification {
//   _id: string
//   recipient: Recipient
//   actor: Actor
//   type: string
//   entityType: string
//   entityId: string
//   isRead: boolean
//   createdAt: string
//   entity: Entity
//   readAt: string
// }

// export interface Recipient {
//   _id: string
//   name: string
//   photo: string
// }

// export interface Actor {
//   _id: string
//   name: string
//   photo: string
// }

// export interface Entity {
//   _id: string
//   body?: string
//   image?: string
//   user?: string
//   commentsCount?: number
//   topComment?: TopComment
//   sharesCount?: number
//   likesCount?: number
//   isShare?: boolean
//   id?: string
//   unavailable?: boolean
// }

// export interface TopComment {
//   _id: string
//   content?: string
//   commentCreator: CommentCreator
//   post: string
//   parentComment: string
//   likes: string[]
//   createdAt: string
//   image?: string
// }

// export interface CommentCreator {
//   _id: string
//   name: string
//   username: string
//   photo: string
// }

// export interface Meta {
//   feedMode: string
//   pagination: Pagination
// }

// export interface Pagination {
//   currentPage: number
//   limit: number
//   total: number
//   numberOfPages: number
//   nextPage: number
// }

// // getUnreadNotifications
// export interface AllUnreadNotificationsResponse {
//   success: boolean
//   message: string
//   data: UnreadNotificationsData
// }

// export interface UnreadNotificationsData {
//   unreadCount: number
// }

// // markAllNotificationAsRead
// export interface AllMarkAllNotificationAsReadResponse {
//   success: boolean
//   message: string
//   data: MarkNotificationData
// }

// export interface MarkNotificationData {
//   modifiedCount: number
// }

// // markNotificationAsRead
// export interface AllMarkNotificationAsReadResponse {
//   success: boolean
//   message: string
//   data: MarkNotificationData
// }

// export interface MarkNotificationData {
//   notification: Notification
// }



// export interface Pagination {
//   currentPage: number
//   limit: number
//   total: number
//   numberOfPages: number
//   nextPage?: number
// }

// export interface Meta {
//   feedMode?: string
//   pagination: Pagination
// }

// export interface Person {
//   _id: string
//   name: string
//   photo?: string
// }
// export type Recipient = Person
// export type Actor = Person

// export interface CommentCreator extends Person {
//   username: string
// }

// export interface TopComment {
//   _id: string
//   content?: string
//   commentCreator: CommentCreator
//   post: string
//   parentComment: string
//   likes: string[]
//   createdAt: string
//   image?: string
// }

// export interface Entity {
//   _id: string
//   id?: string
//   body?: string
//   image?: string
//   user?: string
//   commentsCount?: number
//   topComment?: TopComment
//   sharesCount?: number
//   likesCount?: number
//   isShare?: boolean
//   unavailable?: boolean
// }

// export interface Notification {
//   _id: string
//   recipient: Recipient
//   actor: Actor
//   type: string
//   entityType: string
//   entityId: string
//   isRead: boolean
//   createdAt: string
//   readAt?: string | null
//   entity?: Entity
// }

export interface Pagination {
  currentPage: number
  limit: number
  total: number
  numberOfPages: number
  nextPage?: number
}

export interface Meta {
  feedMode?: string
  pagination: Pagination
}

export interface Person {
  _id: string
  name: string
  photo?: string
}
export type Recipient = Person
export type Actor = Person

export interface CommentCreator extends Person {
  username: string
}

export interface TopComment {
  _id: string
  content?: string
  commentCreator: CommentCreator
  post: string
  parentComment: string
  likes: string[]
  createdAt: string
  image?: string
}

export interface Entity {
  _id: string
  id?: string
  body?: string
  image?: string
  user?: string
  commentsCount?: number
  topComment?: TopComment
  sharesCount?: number
  likesCount?: number
  isShare?: boolean
  unavailable?: boolean
}

export interface Notification {
  _id: string
  recipient: Recipient
  actor: Actor
  type: string
  entityType: string
  entityId: string
  isRead: boolean
  createdAt: string
  readAt?: string | null
  entity?: Entity
}

interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

// GET /notifications
export interface AllNotificationsResponse extends ApiResponse<{ notifications: Notification[] }> {
  meta: Meta
}

// GET /notifications/unread-count
export type AllUnreadNotificationsResponse = ApiResponse<{ unreadCount: number }>

// PATCH /notifications/:id/read
export type AllMarkNotificationAsReadResponse = ApiResponse<{ notification: Notification }>

// PATCH /notifications/read-all
export type AllMarkAllNotificationAsReadResponse = ApiResponse<{ modifiedCount: number }>
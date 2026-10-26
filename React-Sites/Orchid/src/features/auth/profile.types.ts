// ---------- My profile ----------
export interface AllProfileResponse {
  success: boolean
  message: string
  data: ProfileData
}

export interface ProfileData {
  user: UserProfile
}

export interface UserProfile {
  _id: string
  name: string
  username: string
  email: string
  dateOfBirth: string
  gender: string
  photo: string
  cover: string
  bookmarks: string[]
  followers: string[]
  following: string[]
  createdAt: string
  followersCount: number
  followingCount: number
  bookmarksCount: number
  id: string
}

// ---------- Follow / unfollow ----------
export interface AllFollowingResponse {
  success: boolean
  message: string
  data: FollowingData
}

export interface FollowingData {
  following: boolean
  followersCount: number
}

// ---------- Another user's profile ----------
export interface AllUserProfileResponse {
  success: boolean
  message: string
  data: UserProfileData
}

export interface UserProfileData {
  isFollowing: boolean
  user: PublicUser
}

export interface PublicUser {
  _id: string
  name: string
  username: string
  email: string
  dateOfBirth: string
  gender: string
  photo: string
  cover: string
  followers: Follower[]
  following: string[]
  createdAt: string
  followersCount: number
  followingCount: number
  bookmarksCount: number
  id: string
}

export interface Follower {
  _id: string
  name: string
  photo: string
  followersCount: number
  followingCount: number
  bookmarksCount: number
  id: string
}

// ---------- Follow suggestions ----------
export interface AllFollowSuggestionsResponse {
  success: boolean
  message: string
  data: FollowingSuggestionsData
  meta: Meta
}

export interface FollowingSuggestionsData {
  suggestions: Suggestion[]
}

export interface Suggestion {
  _id: string
  name: string
  username: string
  photo: string
  mutualFollowersCount: number
  followersCount: number
}

// ---------- Upload photo ----------
export interface AllUploadProfilePhotoResponse {
  success: boolean
  message: string
  data: UploadProfilePhotoData
}

export interface UploadProfilePhotoData {
  photo: string
  postId: string
}

// ---------- Change password ----------
export interface ChangePasswordReq {
  password: string
  newPassword: string
}

export interface AllChangePasswordResponse {
  success: boolean
  message: string
  data: ChangePasswordData
}

export interface ChangePasswordData {
  token: string
  tokenType: string
  expiresIn: string
}

// ---------- Bookmarks ----------
export interface AllBookmarksResponse {
  success: boolean
  message: string
  data: BookmarksData
  meta: Meta
}

export interface BookmarksData {
  bookmarks: Bookmark[]
}

export interface Bookmark {
  _id: string
  body: string
  privacy: string
  user: BookmarkUser
  sharedPost: string
  likes: string[]
  createdAt: string
  commentsCount: number
  topComment: TopComment
  sharesCount: number
  likesCount: number
  isShare: boolean
  id: string
  bookmarked: boolean
}

export interface BookmarkUser {
  _id: string
  name: string
  username: string
  photo: string
}

export interface TopComment {
  _id: string
  content: string
  commentCreator: BookmarkUser
  post: string
  parentComment: string
  likes: string[]
  createdAt: string
}

// ---------- Shared ----------
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

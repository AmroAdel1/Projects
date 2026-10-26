export interface BookmarkPostResponse {
  success: boolean
  message: string
  data: Bookmark
}

export interface Bookmark {
  bookmarked: boolean
  bookmarksCount: number
}

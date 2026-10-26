import api from "@/api/axios"
import type { AllPostsResponse, PostDetailsResponse } from "@/features/posts/posts.types"
import type { AllLikesResponse, LikePostResponse } from "./likes.types"
import type { BookmarkPostResponse } from "./bookmark.types"
import type { AllSharesResponse } from "./shares.types"

export async function getAllPosts(page: number, limit: number) {
  const response = await api.get<AllPostsResponse>("/posts", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    },
    params: {
      limit,
      page,
      sort: "-createdAt"            // -createdAt => latest
    }
  })
  return response.data
}

export async function getPostDetails(id: string | null) {
  const response = await api.get<PostDetailsResponse>(`/posts/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    },
  })
  return response.data
}

export async function createPost(formData: FormData) {
  const { data } = await api.post<AllPostsResponse>("/posts", formData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    },
  })
  return data
}

export async function updatePost(id: string, formData: FormData) {
  const { data } = await api.put<AllPostsResponse>(`/posts/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    },
  })
  return data
}

export async function deletePost(id: string | null) {
  const { data } = await api.delete<AllPostsResponse>(`/posts/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    },
  })
  return data
}

export async function getPostLikes(id: string | null, page: number, limit: number) {
  const { data } = await api.get<AllLikesResponse>(`/posts/${id}/likes`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    },

    params: {
      limit,
      page,
      sort: "createdAt"
    }
  })
  return data
}

export async function likePost(id: string | null) {
  const { data } = await api.put<LikePostResponse>(`/posts/${id}/like`, null, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    },
  })
  return data
}

export async function bookmarkPost(id: string | null) {
  const { data } = await api.put<BookmarkPostResponse>(`/posts/${id}/bookmark`, null, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    },
  })
  return data
}
export async function sharePost(id: string | null, body: string) {
  const { data } = await api.post<AllSharesResponse>(`/posts/${id}/share`, { body }, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    },
  })
  return data
}

export async function getHomeFeed(page = 1) {
  const response = await api.get<AllPostsResponse>("/posts/feed", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    },
    params: { only: "following", limit: 10, page },
  })
  return response.data
}

// usecontext => work on component. no need to use it here
// /posts?limit=1&page=2&sort=createdAt
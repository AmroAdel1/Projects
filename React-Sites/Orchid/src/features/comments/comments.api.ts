import api from "@/api/axios"
import type { AllCommentsData } from "./comments.types"
import type { AllLikesResponse } from "./likes.types"

export async function getAllComments(page: number, limit: number, id: string) {
  const { data } = await api.get<AllCommentsData>(`/posts/${id}/comments`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    },
    params: {
      limit,
      page,
      sort: "-createdAt"            // -createdAt => latest
    }
  })
  return data
}

export async function createComment(id: string, formData: FormData) {
  const { data } = await api.post<AllCommentsData>(`/posts/${id}/comments`, formData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  })
  return data
}

export async function updateComment(postId: string | null, commentId: string | null, formData: FormData) {
  const { data } = await api.putForm<AllCommentsData>(`/posts/${postId}/comments/${commentId}`, formData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    },
  })
  return data
}

export async function deleteComment(postId: string | null, commentId: string | null) {
  const { data } = await api.delete<AllCommentsData>(`/posts/${postId}/comments/${commentId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    },
  })
  return data
}

export async function likeComment(postId: string | null, commentId: string | null) {
  const { data } = await api.put<AllLikesResponse>(`/posts/${postId}/comments/${commentId}/like`, null, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    },
  })
  return data
}

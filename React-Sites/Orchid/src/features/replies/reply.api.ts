import api from "@/api/axios"
import type { AllRepliesResponse } from "./reply.types"

export async function getAllCommentReplies(page: number, limit: number, postId: string, commentId: string) {
  const { data } = await api.get<AllRepliesResponse>(`/posts/${postId}/comments/${commentId}/replies`, {
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

export async function createReply(postId: string | null, commentId: string | null, formData: FormData) {
  const { data } = await api.post<AllRepliesResponse>(`/posts/${postId}/comments/${commentId}/replies`, formData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    },
  })
  return data
}
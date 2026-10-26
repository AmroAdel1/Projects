import api from "@/api/axios"
import type {
  AuthResponse,
  LoginDataReq,
  RegisterDataReq,
} from "@/features/auth/auth.types"
import type {
  AllBookmarksResponse,
  AllChangePasswordResponse,
  AllFollowingResponse,
  AllFollowSuggestionsResponse,
  AllProfileResponse,
  AllUploadProfilePhotoResponse,
  AllUserProfileResponse,
  ChangePasswordReq,
} from "./profile.types"
import type { AllPostsResponse } from "../posts/posts.types"

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
})

// ---------- Auth ----------
export async function signup(regData: RegisterDataReq) {
  const { data } = await api.post<AuthResponse>("/users/signup", regData)
  return data
}

export async function login(loginData: LoginDataReq) {
  const { data } = await api.post<AuthResponse>("/users/signin", loginData)
  return data
}

// ---------- Profile ----------
export async function getProfile() {
  const { data } = await api.get<AllProfileResponse>("/users/profile-data", {
    headers: authHeaders(),
  })
  return data
}

export async function getUserProfile(id: string) {
  const { data } = await api.get<AllUserProfileResponse>(
    `/users/${id}/profile`,
    { headers: authHeaders() }
  )
  return data
}

export async function getUserPosts(id: string) {
  const { data } = await api.get<AllPostsResponse>(`/users/${id}/posts`, {
    headers: authHeaders(),
  })
  return data
}

// ---------- Social ----------
export async function getFollowSuggestions(limit: number, page = 1) {
  const { data } = await api.get<AllFollowSuggestionsResponse>(
    "/users/suggestions",
    { headers: authHeaders(), params: { limit, page } }
  )
  return data
}

export async function getBookmarks() {
  const { data } = await api.get<AllBookmarksResponse>("/users/bookmarks", {
    headers: authHeaders(),
  })
  return data
}

export async function followUser(id: string) {
  const { data } = await api.put<AllFollowingResponse>(
    `/users/${id}/follow`,
    null,
    { headers: authHeaders() }
  )
  return data
}

// ---------- Account ----------
export async function uploadProfilePhoto(formData: FormData) {
  const { data } = await api.putForm<AllUploadProfilePhotoResponse>(
    "/users/upload-photo",
    formData,
    { headers: authHeaders() }
  )
  return data
}

export async function changePassword(body: ChangePasswordReq) {      // JSON: { password, newPassword }
  const { data } = await api.patch<AllChangePasswordResponse>(
    "/users/change-password",
    body,
    { headers: authHeaders() }
  )
  return data
}

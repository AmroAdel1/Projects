import { jwtDecode } from "jwt-decode"

export function getLoggedUserId() {
  try {
    return jwtDecode<{ user: string }>(localStorage.getItem("token") ?? "").user
  } catch {
    return ""
  }
}
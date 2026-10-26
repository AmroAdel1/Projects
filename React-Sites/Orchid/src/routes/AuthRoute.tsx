import type { ReactNode } from "react"
import { Navigate } from "react-router-dom"

export default function AuthRoute({ children }: { children: ReactNode }) {
  if (localStorage.getItem("token")) {
    return <Navigate to="/posts" />
  } else {
    return children
  }
}

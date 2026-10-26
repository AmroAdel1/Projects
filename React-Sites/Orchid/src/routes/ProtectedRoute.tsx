import type { ReactNode } from "react"
import { Navigate } from "react-router-dom"

// guard
export default function ProtectedRoute({ children }: { children: ReactNode }) {
  if (localStorage.getItem("token")) {
    return children
  } else {
    return <Navigate to="/login" />
  }
}

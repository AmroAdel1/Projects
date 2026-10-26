import { createBrowserRouter, Navigate } from "react-router-dom"
import LoginPage from "@/features/auth/pages/LoginPage"
import RegisterPage from "@/features/auth/pages/RegisterPage"
import AuthLayout from "@/features/layouts/AuthLayout"
import MainLayout from "@/features/layouts/MainLayout"
import PostsPage from "@/features/posts/pages/PostsPage"
import PostDetails from "@/features/posts/pages/PostDetails"
import ProfilePage from "@/features/auth/pages/ProfilePage"
import ProtectedRoute from "./ProtectedRoute"
import AuthRoute from "./AuthRoute"
import HomeFeedPage from "@/features/posts/pages/HomeFeedPage"
import NotificationsPage from "@/features/notifications/pages/NotificationsPage"
import NotFound from "@/pages/NotFound"
import FollowPage from "@/features/auth/pages/FollowPage"

const routes = createBrowserRouter([
  {
    // Logged-out only, no navbar
    element: (
      <AuthRoute>
        <AuthLayout />
      </AuthRoute>
    ),
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
    ],
  },
  {
    // Logged-in only, with navbar
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "/", element: <Navigate to="/posts" replace /> },
      { path: "/posts", element: <PostsPage /> },
      { path: "/feed", element: <HomeFeedPage /> },
      { path: "/posts/:id", element: <PostDetails /> },
      { path: "/profile", element: <ProfilePage /> },
      { path: "/profile/:id", element: <ProfilePage key="other" /> },
      { path: "/notifications", element: <NotificationsPage /> },
      { path: "/follow", element: <FollowPage /> },
    ],
  },
  // Any URL that matched nothing above
  { path: "*", element: <NotFound /> },
])

export default routes

import { createBrowserRouter } from "react-router-dom"
import Layout from "./Components/Layout"
import Home from "./Pages/Home"
import About from "./Pages/About"
import Blogs from "./Pages/Blogs"
import Privacy from "./Pages/Privacy"
import Terms from "./Pages/Terms"
import NotFound from "./Pages/NotFound"
import BlogDetails from "./Pages/BlogDetails"

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "/about", element: <About /> },
      { path: "/blog", element: <Blogs /> },
      { path: "blog/:slug", element: <BlogDetails /> },
      { path: "/privacy", element: <Privacy /> },
      { path: "/terms", element: <Terms /> },
      { path: "*", element: <NotFound /> },
    ],
  },
])

export default routes

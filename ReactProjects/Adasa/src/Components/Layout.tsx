import Navbar from "./Navbar"
import Footer from "./Footer"
import { Outlet, ScrollRestoration } from "react-router-dom"

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      <Outlet />
      <Footer />
      <ScrollRestoration />
    </div>
  )
}
